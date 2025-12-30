import type { DebouncerPlugin } from "../debouncer/types";

type Report = {
	planned: number;
	earliest: number;
	latest: number;
};

export class TimelinePlugin<ARGS extends unknown[], RETURN>
	implements DebouncerPlugin<ARGS, RETURN>
{
	constructor(startTime: number, index: number) {
		this.#startTime = startTime;
		this.#index = index;
		this.#nextReport = {
			planned: startTime,
			earliest: startTime,
			latest: startTime,
		};
	}
	#startTime: number;
	#index: number;
	#nextReport: Report;

	onCalculateBounds: DebouncerPlugin<ARGS, RETURN>["onCalculateBounds"] = (
		controls,
	) => {
		this.#nextReport.earliest =
			controls.nextActivation.earliest - this.#startTime;
		this.#nextReport.latest =
			controls.nextActivation.latest - this.#startTime;
	};
	onCalculateActivation: DebouncerPlugin<
		ARGS,
		RETURN
	>["onCalculateActivation"] = (controls) => {
		this.#nextReport.planned =
			controls.nextActivation.planned - this.#startTime;
	};
	onActivate: DebouncerPlugin<ARGS, RETURN>["onActivate"] = () => {
		postMessage({ index: this.#index, report: this.#nextReport });
	};
}
