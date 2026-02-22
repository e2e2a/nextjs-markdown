import { headers } from 'next/headers';
import * as UAParser from 'ua-parser-js';

export const getHeaders = async () => {
  const headersList = await headers();
  const userAgent = headersList.get('user-agent');
  const parser = new UAParser.UAParser(userAgent || '');
  const deviceType = parser.getDevice().type || 'desktop';
  const os = parser.getOS().name;
  const browser = parser.getBrowser().name;
  const ip =
    headersList.get('x-real-ip') || headersList.get('x-forwarded-for') || headersList.get('host');
  return { ip, os, deviceType, browser, userAgent };
};
