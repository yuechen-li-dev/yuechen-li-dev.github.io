import { Escape } from "./Portal";
import { ClassAttribute, Part } from "./StyleSheet";

function CodeAt(source: string, index: int): int {
    if (index < 0 || index >= source.length) { return -1; }
    return String.CodeAt(source, index);
}

function NameStart(code: int): boolean {
    return (code >= 65 && code <= 90) || (code >= 97 && code <= 122)
        || code == 36 || code == 95 || code >= 128;
}

function Digit(code: int): boolean {
    return code >= 48 && code <= 57;
}

function EndOfName(source: string, start: int): int {
    let end: int = start + 1;
    while (NameStart(CodeAt(source, end)) || Digit(CodeAt(source, end))) {
        end = end + 1;
    }
    return end;
}

function EndOfLine(source: string, start: int): int {
    let end: int = start;
    while (end < source.length && CodeAt(source, end) != 10 && CodeAt(source, end) != 13) {
        end = end + 1;
    }
    return end;
}

function EndOfComment(source: string, start: int): int {
    let end: int = start;
    while (end + 1 < source.length) {
        if (CodeAt(source, end) == 42 && CodeAt(source, end + 1) == 47) {
            return end + 2;
        }
        end = end + 1;
    }
    return source.length;
}

function EndOfString(source: string, start: int, quote: int): int {
    let end: int = start + 1;
    while (end < source.length) {
        const code: int = CodeAt(source, end);
        if (code == quote) { return end + 1; }
        if (quote != 96 && (code == 10 || code == 13)) { return end; }
        if (code == 92 && end + 1 < source.length) {
            end = end + 2;
            if (CodeAt(source, end - 1) == 13 && CodeAt(source, end) == 10) {
                end = end + 1;
            }
        } else {
            end = end + 1;
        }
    }
    return end;
}

function Radix(prefix: int): int {
    if (prefix == 88 || prefix == 120) { return 16; }
    if (prefix == 79 || prefix == 111) { return 8; }
    if (prefix == 66 || prefix == 98) { return 2; }
    return 10;
}

function DigitValue(code: int): int {
    if (Digit(code)) { return code - 48; }
    if (code >= 65 && code <= 70) { return code - 55; }
    if (code >= 97 && code <= 102) { return code - 87; }
    return 16;
}

function EndOfDigits(source: string, start: int, radix: int): int {
    let end: int = start;
    while (DigitValue(CodeAt(source, end)) < radix || CodeAt(source, end) == 95) {
        end = end + 1;
    }
    return end;
}

function EndOfNumber(source: string, start: int): int {
    let end: int = start;
    const radix: int = if CodeAt(source, start) == 48 { Radix(CodeAt(source, start + 1)) } else { 10 };
    if (radix != 10) {
        end = EndOfDigits(source, start + 2, radix);
    } else {
        end = EndOfDigits(source, start, 10);
        if (CodeAt(source, end) == 46 && Digit(CodeAt(source, end + 1))) {
            end = EndOfDigits(source, end + 1, 10);
        }
        if (CodeAt(source, end) == 69 || CodeAt(source, end) == 101) {
            let exponent: int = end + 1;
            if (CodeAt(source, exponent) == 43 || CodeAt(source, exponent) == 45) {
                exponent = exponent + 1;
            }
            if (Digit(CodeAt(source, exponent))) {
                end = EndOfDigits(source, exponent, 10);
            }
        }
    }
    if (CodeAt(source, end) == 110) { return end + 1; }
    return end;
}

function WordPart(source: string, start: int, end: int, copeland: boolean): Option<Part> {
    const word: string = " " + String.Slice(source, start, end) + " ";
    if (CodeAt(source, start - 1) != 46) {
        const shared: string = " abstract as async await break case catch class const continue debugger declare default delete do else enum export extends finally for from function get if implements import in instanceof interface keyof let new of private protected public readonly return satisfies set static super switch this throw try type typeof using var while with yield ";
        const extra: string = " after anchor batch bind column effect except flow instantiate layers layout match on record reflect remote row slot state stream table template ";
        if (String.IndexOf(shared, word) >= 0 || (copeland && String.IndexOf(extra, word) >= 0)) {
            return Some(Part.SyntaxKeyword);
        }
        if (String.IndexOf(" true false null undefined ", word) >= 0 || (copeland && word == " None ")) {
            return Some(Part.SyntaxLiteral);
        }
        if (String.IndexOf(" any bigint boolean never number object string symbol unknown void ", word) >= 0
            || (copeland && String.IndexOf(" int int64 float ", word) >= 0)) {
            return Some(Part.SyntaxType);
        }
    }
    let next: int = end;
    while (CodeAt(source, next) >= 0 && CodeAt(source, next) <= 32) {
        next = next + 1;
    }
    if (CodeAt(source, next) == 40) { return Some(Part.SyntaxFunction); }
    const first: int = CodeAt(source, start);
    if (first >= 65 && first <= 90) { return Some(Part.SyntaxType); }
    return None;
}

export function HighlightCode(source: string, language: string): string {
    const copeland: boolean = language == "copeland" || language == "copeland-template" || language == "tsx"
        || String.IndexOf(language, "copeland:") == 0;
    if (!(copeland || language == "typescript" || language == "ts")) { return Escape(source); }

    let html = "";
    let written = 0;
    let index = 0;
    while (index < source.length) {
        const code: int = CodeAt(source, index);
        const next: int = CodeAt(source, index + 1);
        let end: int = index + 1;
        let part: Option<Part> = None;
        if (code == 47 && next == 47) {
            end = EndOfLine(source, index + 2);
            part = Some(Part.SyntaxComment);
        } else if (code == 47 && next == 42) {
            end = EndOfComment(source, index + 2);
            part = Some(Part.SyntaxComment);
        } else if (code == 34 || code == 39 || code == 96) {
            end = EndOfString(source, index, code);
            part = Some(Part.SyntaxString);
        } else if (Digit(code) || (code == 46 && Digit(next))) {
            end = EndOfNumber(source, index);
            part = Some(Part.SyntaxLiteral);
        } else if (NameStart(code)) {
            end = EndOfName(source, index);
            part = WordPart(source, index, end, copeland);
        }
        match part {
            case Some(style) => {
                html = html + Escape(String.Slice(source, written, index))
                    + "<span" + ClassAttribute(style) + ">"
                    + Escape(String.Slice(source, index, end)) + "</span>";
                written = end;
            }
            case None => {}
        }
        index = end;
    }
    return html + Escape(String.Slice(source, written, source.length));
}
