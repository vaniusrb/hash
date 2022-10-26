export enum CustomGridIcon {
  LABEL = "bpLabel",
  ERROR = "bpError",
  ASTERISK = "bpAsterisk",
}

export const customGridIcons: Record<CustomGridIcon, () => string> = {
  bpAsterisk: () =>
    `<svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M7 0C3.11719 0 0 3.14453 0 7C0 10.8828 3.11719 14 7 14C10.8555 14 14 10.8828 14 7C14 3.14453 10.8555 0 7 0ZM7 12.6875C3.85547 12.6875 1.3125 10.1445 1.3125 7C1.3125 3.88281 3.85547 1.3125 7 1.3125C10.1172 1.3125 12.6875 3.88281 12.6875 7C12.6875 10.1445 10.1172 12.6875 7 12.6875Z" fill="#4D5C6C"/><path d="M10.0156 8.75C9.92188 8.92188 9.75 9 9.57812 9C9.48438 9 9.40625 8.98438 9.32812 8.9375L7.5 7.875V10C7.5 10.2812 7.26562 10.5 7 10.5C6.75 10.5 6.5 10.2812 6.5 10V7.875L4.64062 8.9375C4.5625 8.98438 4.48438 9 4.39062 9C4.21875 9 4.04688 8.92188 3.96875 8.75C3.82812 8.51562 3.90625 8.21875 4.14062 8.07812L5.98438 7L4.14062 5.9375C3.90625 5.79688 3.82812 5.5 3.95312 5.25C4.0625 5.07812 4.26562 4.98438 4.45312 5.01562C4.51562 5.01562 4.57812 5.04688 4.64062 5.07812L6.5 6.14062V4C6.5 3.73438 6.71875 3.5 7 3.5C7.26562 3.5 7.5 3.73438 7.5 4V6.14062L9.34375 5.07812C9.40625 5.04688 9.46875 5.01562 9.53125 5.01562C9.71875 4.98438 9.92188 5.07812 10.0156 5.25C10.1406 5.5 10.0625 5.79688 9.82812 5.9375L8 7L9.84375 8.07812C10.0781 8.21875 10.1562 8.51562 10.0156 8.75Z" fill="#4D5C6C"/></svg>`,
  bpError: () =>
    `<svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M7 0C3.11719 0 0 3.14453 0 7C0 10.8828 3.11719 14 7 14C10.8555 14 14 10.8828 14 7C14 3.14453 10.8555 0 7 0ZM7 12.6875C3.85547 12.6875 1.3125 10.1445 1.3125 7C1.3125 3.88281 3.85547 1.3125 7 1.3125C10.1172 1.3125 12.6875 3.88281 12.6875 7C12.6875 10.1445 10.1172 12.6875 7 12.6875ZM7 8.3125C7.35547 8.3125 7.65625 8.03906 7.65625 7.65625V4.15625C7.65625 3.80078 7.35547 3.5 7 3.5C6.61719 3.5 6.34375 3.80078 6.34375 4.15625V7.65625C6.34375 8.03906 6.61719 8.3125 7 8.3125ZM7 9.24219C6.50781 9.24219 6.125 9.625 6.125 10.0898C6.125 10.5547 6.50781 10.9375 7 10.9375C7.46484 10.9375 7.84766 10.5547 7.84766 10.0898C7.84766 9.625 7.46484 9.24219 7 9.24219Z" fill="#DF3449"/></svg>`,
  bpLabel: () =>
    `<svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M7 0C3.11719 0 0 3.14453 0 7C0 10.8828 3.11719 14 7 14C10.8555 14 14 10.8828 14 7C14 3.14453 10.8555 0 7 0ZM7 12.6875C3.85547 12.6875 1.3125 10.1445 1.3125 7C1.3125 3.88281 3.85547 1.3125 7 1.3125C10.1172 1.3125 12.6875 3.88281 12.6875 7C12.6875 10.1445 10.1172 12.6875 7 12.6875Z" fill="#4D5C6C"/><path d="M4.5 3.5H6.82812C7.09375 3.5 7.34375 3.60938 7.53125 3.79688L10.2812 6.54688C10.6719 6.9375 10.6719 7.57812 10.2812 7.96875L8.20312 10.0469C7.8125 10.4375 7.17188 10.4375 6.78125 10.0469L4.03125 7.29688C3.84375 7.10938 3.75 6.85938 3.75 6.59375V4.25C3.75 3.84375 4.07812 3.5 4.5 3.5ZM5.5 5.75C5.76562 5.75 6 5.53125 6 5.25C6 4.98438 5.76562 4.75 5.5 4.75C5.21875 4.75 5 4.98438 5 5.25C5 5.53125 5.21875 5.75 5.5 5.75Z" fill="#4D5C6C"/></svg>`,
};
