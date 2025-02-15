import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function convertToPlainObject<T>(value: T): T {
  return JSON.parse(JSON.stringify(value));
}


export function formatNumberWithDecimal(num: number): string {
  const [int, decimal] = num.toString().split('.')
  return decimal ? `${int}.${decimal.padEnd(2, '0')}` : `${int}.00`
}

export function formatError(error: any) {
  if(error.name == 'ZodError') {
        const fieldError = Object.keys(error.errors).map((field) => error.errors[field].message);
        console.log('fieldError', fieldError)
        return fieldError.join('. ')
  } else if(error.name == 'PrismaClientKnownRequestError' && error.code == 'P2002') {} else {

  }
}

// Round number to 2 decimal places
export function round2(value: number | string) {
}