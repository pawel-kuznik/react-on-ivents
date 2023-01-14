import { Reader } from "./Reader";

describe('Reader', () => {

    it('should load data', async () => {

        const reader = new Reader(() => Promise.resolve(42));
        await reader.start();
        const result = reader.read();

        expect(result).toEqual(42);
    });
    it('should throw when the data is not yet there', done => {

        try {
            const reader = new Reader(() => Promise.resolve(42));
            reader.start();
            reader.read();
        }

        catch(reason: any) {

            expect('then' in reason).toBeTruthy();
            done();
        }
    });
    it('should throw when read without starting (cause it needs to ask for load)', done => {

        try {
            const reader = new Reader(() => Promise.resolve(42));
            reader.read();
        }

        catch(reason: any) {

            expect('then' in reason).toBeTruthy();
            done();
        }
    });
    it('should honor the parameter', async () => {

        const reader = new Reader<number, number>((param: number) => Promise.resolve(param));
        const startResult = await reader.start(42);
        expect(startResult).toEqual(42);
        expect(reader.result).toEqual(42);
        expect(reader.read(42)).toEqual(42);
    });
    it('should assign error when promise rejects', async () => {

        const error = Error("good");
        const reader = new Reader<void>(() => Promise.reject(error));
        await reader.start();
        expect(reader.error).toEqual(error);
    });
    it('should not reload when the parameter does not change', async () => {

        const reader = new Reader<number, number>((param: number) => Promise.resolve(param));
        await reader.start(42);
        expect(() => reader.read(42)).not.toThrow();
    });
    it('should reload when the parameter changes', async () => {

        const reader = new Reader<number, number>((param: number) => Promise.resolve(param));
        await reader.start(42);
        expect(() => reader.read(16)).toThrow();
    });
});