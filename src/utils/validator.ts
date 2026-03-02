export class Validator {
    static isNonEmpty(value: string, fieldName: string): void {
        if (!value || value.trim().length === 0) {
            throw new Error(`${fieldName} cannot be empty.`);
        }
    }

    static isValidTimezone(tz: string): boolean {
        try {
            Intl.DateTimeFormat(undefined, { timeZone: tz });
            return true;
        } catch {
            return false;
        }
    }

    static isValidMathExpression(expr: string): boolean {
        // Only allow digits, operators, spaces, dots, parentheses
        return /^[0-9+\-*/.^% ()]+$/.test(expr);
    }
}
