import { Reader } from "./Reader";

describe('Reader', () => {

    it('should load data', () => {

        const reader = new Reader(() => Promise.resolve(42));
        reader.start();
        const result = reader.read();

        expect(result).toEqual(42);
    });
});