type Observer<T> = (t: T) => void;

export default class Observable<T> {
  private _observers: Observer<T>[] = [];

  set value(v: T) {
    this.next(v);
  }

  constructor(private _value: T) {}

  subscribe(o: Observer<T>) {
    this._observers.push(o);
  }

  unsubscribe(o: Observer<T>) {
    this._observers = this._observers.filter((x) => x === o);
  }

  next(v: T) {
    this._value = v;
    this.broadcast();
  }

  broadcast() {
    this._observers.forEach((o) => o && o(this._value));
  }

  clear() {
    this._observers = [];
  }
}
