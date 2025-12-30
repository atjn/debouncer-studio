import type { Unsubscriber, Writable } from "svelte/store";
import { cssQueries, type CSSQueries } from "../cssQueries.ts";
import { editor, Uri, languages, type IDisposable } from "monaco-editor";
import editorWorker from "monaco-editor/esm/vs/editor/editor.worker?worker";
import jsonWorker from "monaco-editor/esm/vs/language/json/json.worker?worker";
import tsWorker from "monaco-editor/esm/vs/language/typescript/ts.worker?worker";
import { debouncerImports } from "../debouncer.ts";

let isInitialized = false;

let initialisedEditor: editor.IStandaloneCodeEditor | undefined;
let debouncerModel: editor.ITextModel | undefined;
let sourceCodeUnsubscriber: Unsubscriber | undefined;
let cssQueriesUnsubscriber: Unsubscriber | undefined;
let modelEventDisposer: IDisposable | undefined;

export function setupEditor(
	domElement: HTMLElement,
	sourceCode: Writable<string>,
) {
	if (!isInitialized && domElement && "window" in globalThis) {
		isInitialized = true;
		globalThis.window.MonacoEnvironment = {
			getWorker: function (workerId: any, label: string) {
				switch (label) {
					case "json":
						return new jsonWorker();
					case "javascript":
					case "typescript":
						return new tsWorker();
					default:
						return new editorWorker();
				}
			},
		};
		languages.typescript.typescriptDefaults.setEagerModelSync(true);
		languages.typescript.typescriptDefaults.setCompilerOptions({
			allowImportingTsExtensions: true,
			forceConsistentCasingInFileNames: true,
			isolatedModules: true,
			strict: true,
		});
		for (const [path, code] of Object.entries(debouncerImports)) {
			editor.createModel(
				String(code),
				"typescript",
				Uri.parse(`file:///${path.slice(2)}`),
			);
		}
		debouncerModel = editor.createModel(
			"",
			"typescript",
			Uri.parse("file:///index.ts"),
		);
	}
	sourceCodeUnsubscriber ??= sourceCode.subscribe((code) => {
		debouncerModel!.setValue(code);
	});
	cssQueriesUnsubscriber ??= cssQueries.subscribe(setTheme);
	modelEventDisposer ??= debouncerModel!.onDidChangeContent(() => {
		sourceCode.set(debouncerModel!.getValue());
	});

	initialisedEditor ??= editor.create(domElement, {
		ariaLabel: "Edit code",
		autoDetectHighContrast: false,
		automaticLayout: true,
		lineNumbersMinChars: 2,
		minimap: {
			enabled: false,
		},
		language: "typescript",
	});
	initialisedEditor.setModel(debouncerModel!);

	return initialisedEditor;
}

function setTheme(queries: CSSQueries) {
	let theme = "";
	if (queries.prefersContrast) {
		theme += "hc";
		if (queries.prefersDark) {
			theme += "-black";
		} else {
			theme += "-light";
		}
	} else {
		theme += "vs";
		if (queries.prefersDark) {
			theme += "-dark";
		}
	}
	editor.setTheme(theme);
}

export function disposeEditor() {
	modelEventDisposer?.dispose();
	modelEventDisposer = undefined;
	cssQueriesUnsubscriber?.();
	cssQueriesUnsubscriber = undefined;
	sourceCodeUnsubscriber?.();
	sourceCodeUnsubscriber = undefined;
	initialisedEditor?.dispose();
	initialisedEditor = undefined;
}
