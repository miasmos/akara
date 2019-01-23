class Subject {
    constructor(public readonly fn: Function) {}
}
interface Subjects {
    [key: string]: Array<Subject>;
}

export class Observer {
    private subjects: Subjects = {};

    public on(event: string, fn: Function): void {
        if (!(event in this.subjects)) {
            const namespace: Subject[] = [];
            this.subjects[event] = new Array<Subject>(0);
        }
        this.subjects[event].push(new Subject(fn));
    }

    public emit(event: string, ...params: any[]): void {
        if (event in this.subjects) {
            const namespace = Object.values(this.subjects[event]);
            for (let subject of namespace) {
                subject.fn.apply(this, params);
            }
        }
    }

    public off(event: string, fn?: Function): void {
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
