pub struct SpecialTokens;

impl SpecialTokens {
    pub const NOT_FOUND: &'static str = "&_NOT_FOUND";
    pub const EMPTY: &'static str = "&_EMPTY";

    pub fn is_special_token(value: &str) -> bool {
        value.starts_with("&_")
    }
}