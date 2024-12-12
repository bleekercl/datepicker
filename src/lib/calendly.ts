// src/lib/calendly.ts
import { CommonSlot, AvailabilityResponse, CalendlyEventInfo } from './types'
import { parseISO, format } from 'date-fns'

export function parseCalendlyUrl(url: string): CalendlyEventInfo {
  try {
    const urlObj = new URL(url)
    const pathParts = urlObj.pathname.split('/').filter(Boolean)
    
    if (pathParts.length < 2) {
      throw new Error('Invalid Calendly URL format')
    }

    return {
      username: pathParts[0],
      eventSlug: pathParts[1]
    }
  } catch (error) {
    throw new Error(`Invalid Calendly URL: ${error instanceof Error ? error.message : 'Unknown error'}`)
  }
}

export async function findCommonAvailability(
  eventUrls: string[],
  startDate: string,
  endDate: string
): Promise<CommonSlot[]> {
  try {
    const response = await fetch('/api/availability', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        eventUrls,
        startDate,
        endDate
      }),
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.error || 'Failed to fetch availability')
    }

    const data = await response.json() as AvailabilityResponse
    return data.slots
  } catch (err) {
    throw new Error(err instanceof Error ? err.message : 'An unexpected error occurred')
  }
}

export function formatSlotTime(date: string): string {
  return format(parseISO(date), 'h:mm a')
}

export function formatSlotDate(date: string): string {
  return format(parseISO(date), 'yyyy-MM-dd')
}