export const imports = `import { Debouncer } from "./debouncer/Debouncer.ts"`;

export const separator = `\n\n`;

export const expression = {
	start: `export default new Debouncer(() => {}, [`,
	end: `\n]);\n`,
};
