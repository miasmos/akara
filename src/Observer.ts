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
    public suppress: boolean = false;

    public on(event: string, fn: Function): boolean {
        event = event.toString();
        if (!(event in this.subjects)) {
            this.subjects[event] = [];
        }
        this.subjects[event].push(new Subject(fn));
        return true;
    }

    public emit(event: string, ...params: unknown[]): boolean {
        if (this.suppress) {
            return false;
        }
        event = event.toString();

        if (event in this.subjects) {
            Object.values(this.subjects[event]).forEach((subject: Subject) => {
                subject.fn.apply(this, params);
            });
        }
        return true;
    }

    public off(event: string, fn?: Function): boolean {
        event = event.toString();
        if (!(event in this.subjects)) {
            return false;
        }
        if (typeof fn === 'function') {
            const namespace = Object.values(this.subjects[event]);
            for (let index = 0; index < namespace.length; index += 1) {
                const subject: Subject = namespace[index];
                if (subject.fn === fn) {
                    this.subjects[event].splice(index, 1);
                }
            }
        } else {
            delete this.subjects[event];
        }
        return true;
    }
}
