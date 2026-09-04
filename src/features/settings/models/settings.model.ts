export interface AppSettings {
  hijriOffsetDays: number; // e.g. -2, -1, 0, +1, +2
  eveningReminderEnabled: boolean;
  eveningReminderHour: number;
  eveningReminderMinute: number;
  morningReminderEnabled: boolean;
  fridayReminderEnabled: boolean;
  hasCompletedOnboarding: boolean;
}

export const DEFAULT_SETTINGS: AppSettings = {
  hijriOffsetDays: 0,
  eveningReminderEnabled: true,
  eveningReminderHour: 21,
  eveningReminderMinute: 30,
  morningReminderEnabled: false,
  fridayReminderEnabled: true,
  hasCompletedOnboarding: false,
};

