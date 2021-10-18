export type ValidationRule = (v: any) => string | undefined;
export type ValidationUnless = (v: any) => boolean;

export class Validator {
  protected _rules: ValidationRule[] = [];
  protected _checkers: ValidationUnless[] = [];

  constructor(protected _v: any) {}

  unless(checker: ValidationUnless): Validator {
    this._checkers.push(checker);
    return this;
  }

  optional(): Validator {
    this.unless((v) => v == null);
    return this;
  }

  validate(r: ValidationRule) {
    this._rules.push(r);
  }

  build(): string | undefined {
    // if any of the unless rules dont proceed to checking the rules below
    if (!this._checkUnless(this._v)) return undefined;

    for (const r of this._rules) {
      const err = r(this._v);
      if (err) return err;
    }

    return undefined;
  }

  private _checkUnless(v: any): boolean {
    for (const c of this._checkers) {
      if (c(v)) return false;
    }

    return true;
  }
}
