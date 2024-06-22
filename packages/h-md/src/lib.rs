#![deny(clippy::all)]
use napi::bindgen_prelude::*;
use futures::prelude::*;
use html2text as html2text;
use process_webpage::{process_webpage, Options};
mod special_tokens;
mod process_webpage;
mod post_process;
use napi::*;

#[macro_use]
extern crate napi_derive;


#[napi]
pub fn html_to_text(html: String) -> String {
  html2text::from_read(html.as_bytes(), 80)
}

#[napi]
pub async fn process_web(options: Options, schema: String) -> String {
  let schema_value = serde_json::from_str(&schema).unwrap();
  let result = process_webpage(options,schema_value).await;
  match result {
    Ok(value) => {
      return value.to_string();
    }
    Err(e) => {
      panic!("Error: {:?}", e);
    }
  }
}