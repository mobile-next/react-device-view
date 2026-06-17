import React from 'react';
import { createRoot } from 'react-dom/client';
import { DeviceView } from './DeviceView';
import type { DeviceViewProps } from './types';

export function render(container: HTMLElement, props: DeviceViewProps) {
	const root = createRoot(container);
	root.render(<DeviceView {...props} />);
	return () => root.unmount();
}
