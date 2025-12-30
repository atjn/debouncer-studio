import { get, type Writable } from "svelte/store";
import { initialize, build, type Plugin, type BuildResult } from "esbuild-wasm";
import wasmURL from "esbuild-wasm/esbuild.wasm?url";
import { debouncerImports } from "./debouncer.ts";

const namespace = "embedded-module";
const editorNamespace = "editor-index";

let isInitialized = false;
export async function buildCustom(
	editorCode: Writable<string>,
): Promise<BuildResult> {
	if (!isInitialized) {
		isInitialized = true;
		await initialize({
			wasmURL,
		});
	}
	return await build({
		entryPoints: ["file:///index.ts"],
		platform: "browser",
		format: "esm",
		bundle: true,
		minify: true,
		treeShaking: true,
		metafile: true,
		plugins: [browserResolver(editorCode)],
	});
}

function browserResolver(editorCode: Writable<string>): Plugin {
	return {
		name: "browser-resolver",
		async setup(build) {
			build.onResolve({ filter: /^file:\/\/\/index\.ts$/ }, (args) => {
				return {
					path: args.path,
					namespace: editorNamespace,
				};
			});
			build.onLoad(
				{
					filter: /^file:\/\/\/index\.ts$/,
					namespace: editorNamespace,
				},
				async (args) => {
					return {
						contents: get(editorCode),
						loader: "ts",
					};
				},
			);

			build.onResolve({ filter: /.*/ }, (args) => {
				const url = new URL(args.path, new URL(args.importer, "file:"));
				normalizeURL(url);
				if (url.pathname === "/debouncer.ts") {
					url.pathname = "/debouncer/mod.ts";
				}
				return {
					path: url.href,
					namespace,
				};
			});
			build.onLoad(
				{ filter: /^file:\/\/\/debouncer.*\.ts$/, namespace },
				async (args) => {
					const importPath = `.${args.path.slice(7)}`;
					const code = debouncerImports[importPath];
					if (code) {
						return {
							contents: String(code),
							loader: "ts",
						};
					}
				},
			);
		},
	};
}

function normalizeURL(url: URL): void {
	if (url.href.endsWith("/")) {
		url.href = url.href.slice(0, -1);
	}
	if (!url.href.endsWith(".ts")) {
		url.href = `${url.href}.ts`;
	}
}
