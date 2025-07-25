export interface TimeSlot {
  start: string; // "HH:MM" format (24-hour)
  end: string;   // "HH:MM" format (24-hour)
}

export interface DayAvailability {
  isAvailable: boolean;
  timeSlots: TimeSlot[];
}

export interface WeeklyAvailability {
  monday: DayAvailability;
  tuesday: DayAvailability;
  wednesday: DayAvailability;
  thursday: DayAvailability;
  friday: DayAvailability;
  saturday: DayAvailability;
  sunday: DayAvailability;
}

export interface ExclusionTime {
  id: string;
  name: string; // e.g., "Lunch Break", "Meeting"
  start: string; // "HH:MM" format
  end: string;   // "HH:MM" format
  daysOfWeek: string[]; // Array of day names: ["monday", "tuesday", ...]
  description?: string;
}

export interface AvailabilityData {
  timezone: string; // Canadian timezone identifier
  weeklySchedule: WeeklyAvailability;
  exclusions: ExclusionTime[];
}

export const CANADIAN_TIMEZONES = [
  { value: 'America/St_Johns', label: 'Newfoundland Time (NST/NDT)', province: 'NL' },
  { value: 'America/Halifax', label: 'Atlantic Time (AST/ADT)', province: 'NS, NB, PE' },
  { value: 'America/Toronto', label: 'Eastern Time (EST/EDT)', province: 'ON, QC' },
  { value: 'America/Winnipeg', label: 'Central Time (CST/CDT)', province: 'MB, SK' },
  { value: 'America/Edmonton', label: 'Mountain Time (MST/MDT)', province: 'AB' },
  { value: 'America/Vancouver', label: 'Pacific Time (PST/PDT)', province: 'BC' },
  { value: 'America/Whitehorse', label: 'Yukon Time (YST/YDT)', province: 'YT' },
] as const;

export const DAYS_OF_WEEK = [
  'monday',
  'tuesday', 
  'wednesday',
  'thursday',
  'friday',
  'saturday',
  'sunday'
] as const;

export const DAY_LABELS = {
  monday: 'Monday',
  tuesday: 'Tuesday',
  wednesday: 'Wednesday', 
  thursday: 'Thursday',
  friday: 'Friday',
  saturday: 'Saturday',
  sunday: 'Sunday'
} as const;

export type DayOfWeek = typeof DAYS_OF_WEEK[number];

// Helper function to create default availability
export const createDefaultAvailability = (): AvailabilityData => ({
  timezone: 'America/Toronto', // Default to Eastern Time
  weeklySchedule: {
    monday: { isAvailable: true, timeSlots: [{ start: '09:00', end: '17:00' }] },
    tuesday: { isAvailable: true, timeSlots: [{ start: '09:00', end: '17:00' }] },
    wednesday: { isAvailable: true, timeSlots: [{ start: '09:00', end: '17:00' }] },
    thursday: { isAvailable: true, timeSlots: [{ start: '09:00', end: '17:00' }] },
    friday: { isAvailable: true, timeSlots: [{ start: '09:00', end: '17:00' }] },
    saturday: { isAvailable: false, timeSlots: [] },
    sunday: { isAvailable: false, timeSlots: [] }
  },
  exclusions: []
});

// Helper function to validate time format
export const isValidTime = (time: string): boolean => {
  const timeRegex = /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/;
  return timeRegex.test(time);
};

// Helper function to convert time to minutes for comparison
export const timeToMinutes = (time: string): number => {
  const [hours, minutes] = time.split(':').map(Number);
  return hours * 60 + minutes;
};

// Helper function to validate time slot
export const isValidTimeSlot = (slot: TimeSlot): boolean => {
  return isValidTime(slot.start) && 
         isValidTime(slot.end) && 
         timeToMinutes(slot.start) < timeToMinutes(slot.end);
};