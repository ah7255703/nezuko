#![deny(clippy::all)]
use html2text as html2text;
 

#[macro_use]
extern crate napi_derive;


#[napi]
pub fn html_to_text(html: String) -> String {
  html2text::from_read(html.as_bytes(), 80)
}

#[napi]
pub fn sum(a: i32, b: i32) -> i32 {
  a + b
}
