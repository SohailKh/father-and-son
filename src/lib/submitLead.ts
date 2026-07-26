import { trackEvent } from './analytics';

export interface LeadFormData {
  address: string;
  city?: string;
  name: string;
  phone: string;
  email?: string;
  situation?: string;
  timeline?: string;
  source: 'hero' | 'contact' | 'instant-offer';
  /** Property details captured by the instant-offer flow. */
  beds?: string;
  baths?: string;
  condition?: string;
}

const SOURCE_LABELS: Record<LeadFormData['source'], string> = {
  hero: 'Homepage Hero Form',
  contact: 'Contact Page Form',
  'instant-offer': 'Instant Offer Request',
};

export interface SubmitResult {
  success: boolean;
  message: string;
}

export async function submitLead(data: LeadFormData): Promise<SubmitResult> {
  const accessKey = import.meta.env.VITE_WEB3FORMS_KEY;

  if (!accessKey) {
    return { success: false, message: 'Form is not configured. Please call us directly at (949) 541-2003.' };
  }

  try {
    const response = await fetch('https://api.web3forms.com/submit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        access_key: accessKey,
        subject: `New Lead from ${SOURCE_LABELS[data.source]}: ${data.name}`,
        from_name: 'Father & Son Home Buyers Website',
        'Property Address': data.address,
        'City': data.city || 'Not captured',
        'Name': data.name,
        'Phone': data.phone,
        'Email': data.email || 'Not provided',
        'Situation': data.situation || 'Not specified',
        'Timeline': data.timeline || 'Not specified',
        ...(data.beds ? { 'Beds': data.beds } : {}),
        ...(data.baths ? { 'Baths': data.baths } : {}),
        ...(data.condition ? { 'Condition': data.condition } : {}),
        'Form Source': SOURCE_LABELS[data.source],
        botcheck: '',
      }),
    });

    const result = await response.json();

    if (result.success) {
      trackEvent('generate_lead', { form_source: data.source });
      return { success: true, message: "Thank you! We'll be in touch within 24 hours." };
    } else {
      console.error('Web3Forms error:', result);
      return { success: false, message: result.message || 'Something went wrong. Please try again or call us at (949) 541-2003.' };
    }
  } catch {
    return { success: false, message: 'Network error. Please try again or call us at (949) 541-2003.' };
  }
}
