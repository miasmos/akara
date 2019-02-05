export class String {
    public static leftpad(str: string = '', len: number = str.length, ch: string = ' '): string {
        if (len <= str.length) {
            return str;
        }
        len -= str.length;

        let pad = '';
        while (true) {
            if (len & 1) {
                pad += ch;
            }
            len >>= 1;

            if (len) {
                ch += ch;
            } else {
                break;
            }
        }

        return pad + str;
    }
}
