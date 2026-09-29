import { AlertCircle, RefreshCw } from "lucide-react";

interface ErrorBoundaryProps {
	error: unknown;
	reset: () => void;
}

export function ErrorBoundary({ error: rawError, reset }: ErrorBoundaryProps) {
	const error =
		rawError instanceof Error ? rawError : new Error(String(rawError));
	const isDev = import.meta.env.DEV;

	return (
		<div className="flex min-h-screen items-center justify-center bg-gray-50 p-4">
			<div className="w-full max-w-2xl rounded-lg border border-red-200 bg-white shadow-lg">
				<div className="border-b border-red-200 bg-red-50 px-6 py-4">
					<div className="flex items-center gap-3">
						<AlertCircle className="h-6 w-6 text-red-600" />
						<h1 className="text-xl font-bold text-red-900">
							Something went wrong
						</h1>
					</div>
				</div>

				<div className="space-y-4 p-6">
					<div>
						<h2 className="mb-2 text-sm font-semibold text-gray-700">
							Error Message
						</h2>
						<div className="rounded-md bg-gray-50 p-4">
							<p className="font-mono text-sm text-red-600">
								{error.message || "Unknown error occurred"}
							</p>
						</div>
					</div>

					{isDev && error.stack && (
						<div>
							<h2 className="mb-2 text-sm font-semibold text-gray-700">
								Stack Trace
							</h2>
							<div className="max-h-64 overflow-auto rounded-md bg-gray-900 p-4">
								<pre className="font-mono text-xs text-gray-100">
									{error.stack}
								</pre>
							</div>
						</div>
					)}

					<div className="flex flex-col gap-3 pt-2 sm:flex-row">
						<button
							type="button"
							onClick={reset}
							className="flex items-center justify-center gap-2 rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
						>
							<RefreshCw className="h-4 w-4" />
							Reset Application
						</button>
					</div>
				</div>
			</div>
		</div>
	);
}
