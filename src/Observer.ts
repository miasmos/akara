class Subject {
    public readonly fn: Function;
    public constructor(fn: Function) {
        this.fn = fn;
    }
}
interface ISubjects {
    [key: string]: Subject[];
}

export class Observer {
    private subjects: ISubjects = {};

    public on(event: string | number, fn: Function): void {
        event = event.toString();
        if (!(event in this.subjects)) {
            this.subjects[event] = [];
        }
        this.subjects[event].push(new Subject(fn));
    }

    public emit<T>(event: string | number, ...params: T[]): void {
        event = event.toString();
        if (event in this.subjects) {
            const namespace = Object.values(this.subjects[event]);
            for (let subject of namespace) {
                subject.fn.apply(this, params);
            }
        }
    }

    public off(event: string | number, fn?: Function): void {
        event = event.toString();
        if (!(event in this.subjects)) {
            return;
        }
        if (typeof fn === 'function') {
            const namespace = Object.values(this.subjects[event]);
            for (let index = 0; index < namespace.length; index++) {
                const subject: Subject = namespace[index];
                if (subject.fn === fn) {
                    this.subjects[event].splice(0, index);
                }
            }
        } else {
            delete this.subjects[event];
        }
    }
}
