use std::collections::HashMap;
use reqwest::header::{HeaderMap, HeaderName, HeaderValue};
use serde_json::{Map, Value};
use select::document::Document;
use select::predicate::Name;
use thiserror::Error;
use crate::special_tokens::SpecialTokens;
use reqwest::Client;

#[derive(Debug)]
#[napi(object)]
pub struct Options {
    pub url: String,
    pub params: Option<HashMap<String, String>>,
    pub headers: Option<HashMap<String, String>>,
    pub method: Option<String>,
}


#[derive(Error, Debug)]
pub enum ScraperError {
    #[error("Failed to fetch {url}: {status_text}")]
    FetchError { url: String, status_text: String },
    #[error("Invalid schema: {0}")]
    InvalidSchemaError(String),
    #[error("Scraper error: {0}")]
    GeneralError(String),
}


fn validate_schema(schema: &Value) -> Result<(), ScraperError> {
    if let Some(obj) = schema.as_object() {
        for (key, value) in obj {
            if value.get("$sub").is_some() {
                validate_schema(value.get("$sub").unwrap())?;
            } else if value.get("$childrenSchema").is_some() {
                validate_schema(value.get("$childrenSchema").unwrap())?;
            } else if !value.get("$selector").is_some() {
                return Err(ScraperError::InvalidSchemaError("Missing $selector in schema".to_string()));
            }
        }
    }
    Ok(())
}


pub async fn process_webpage(options: Options, schema: Value) -> Result<Value, ScraperError> {
    let Options { url,  params: _, headers, method } = options;

    validate_schema(&schema)?;

    let client = Client::new();
    let mut request = client.request(method.unwrap_or("GET".to_string()).parse().unwrap(), &url);

    if let Some(headers_map) = headers {
        let mut req_headers = HeaderMap::new();
        for (key, value) in headers_map {
            req_headers.insert(
                HeaderName::from_bytes(key.as_bytes()).unwrap(),
                HeaderValue::from_str(&value).unwrap()
            );
        }
        request = request.headers(req_headers);
    }

    let response = request.send().await.map_err(|e| ScraperError::FetchError {
        url: url.clone(),
        status_text: e.to_string(),
    })?;
    if !response.status().is_success() {
        return Err(ScraperError::FetchError {
            url: url.clone(),
            status_text: response.status().to_string(),
        });
    }

    let html = response.text().await.map_err(|e| ScraperError::FetchError {
        url: url.clone(),
        status_text: e.to_string(),
    })?;
    let document = Document::from(html.as_str());

    // Convert `&Value` to `&Schema`
    let schema = schema.as_object().ok_or(ScraperError::InvalidSchemaError("Schema is not an object".to_string()))?;
    let schema: &Schema = unsafe { std::mem::transmute(schema) };

    // Process the schema
    let result = process_schema(schema, &document)?;

    // Convert `HashMap<String, Value>` to `Map<String, Value>`
    let result: Map<String, Value> = result.into_iter().collect();

    Ok(Value::Object(result))
}

#[derive(Debug)]
pub struct KV {
    selector: String,
    attr: Option<String>,
    post: Option<PostProcess>,
}

#[derive(Debug)]
pub struct KVSub {
    sub: Schema,
}

#[derive(Debug)]
pub struct KVSubArray {
    parent_selector: String,
    children_schema: Schema,
}

pub type Schema = HashMap<String, KVType>;

#[derive(Debug)]
pub enum KVType {
    KV(KV),
    KVSub(KVSub),
    KVSubArray(KVSubArray),
}
#[derive(Debug)]
pub enum PostProcess {
    Trim,
    Split { delimiter: String },
}

pub fn post_process_text(value: String, post_process: &PostProcess) -> Value {
    match post_process {
        PostProcess::Trim => Value::String(value.trim().to_string()),
        PostProcess::Split { delimiter } => Value::Array(
            value
                .split(delimiter)
                .map(|v| Value::String(v.trim().to_string()))
                .collect(),
        ),
    }
}

fn handle_kv(kv: &KV, document: &Document)-> String {
    let selector = kv.selector.as_str();
    let attr = kv.attr.as_deref();
    let element = document.find(Name(selector)).next();
    let mut value = match element {
        None => SpecialTokens::NOT_FOUND.to_string(),
        Some(el) => match attr {
            Some(attr_name) => match el.attr(attr_name) {
                Some(attr_value) => attr_value.to_string(),
                None => SpecialTokens::EMPTY.to_string(),
            },
            None => el.text(),
        },
    };

    if value.is_empty() {
        value = SpecialTokens::EMPTY.to_string();
    }

    if SpecialTokens::is_special_token(&value) {
        return value;
    }

    if let Some(post_process) = &kv.post {
        value = post_process_text(value, post_process).to_string();
    }

    value
}


fn process_schema(schema: &Schema, document: &Document) -> Result<Map<String, Value>, ScraperError> {
    let mut result = Map::new();

    for (key, kv_type) in schema {
        let value = match kv_type {
            KVType::KV(kv) => Value::String(handle_kv(kv, document)),
            KVType::KVSub(kv_sub) => {
                let sub_result = process_schema(&kv_sub.sub, document)?;
                Value::Object(sub_result)
            }
            KVType::KVSubArray(kv_sub_array) => {
                let mut children = vec![];
                for element in document.find(Name(kv_sub_array.parent_selector.as_str())) {
                    let child_doc = Document::from(element.html().as_str());
                    let child_result = process_schema(&kv_sub_array.children_schema, &child_doc)?;
                    children.push(Value::Object(child_result));
                }
                Value::Array(children)
            }
        };
        result.insert(key.clone(), value);
    }

    Ok(result)
}