export class String {
    public static leftpad(str: string = '', len: number = str.length, ch: string = ' '): string {
        if (len <= str.length) {
            return str;
        }
        len -= str.length;

        let pad = '';
        while (len) {
            if (len & 1) { // eslint-disable-line no-bitwise
                pad += ch;
            }
            len >>= 1; // eslint-disable-line no-bitwise

            if (len) {
                ch += ch;
            }
        }

        return pad + str;
    }
}
