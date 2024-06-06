use serde_json::Value;

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