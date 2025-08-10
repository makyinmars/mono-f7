import { createDb } from '@repo/db/client';
import { betterAuth } from 'better-auth';
import { getBaseOptions } from './server';

// This export is strictly for the CLI to work with bun auth:schema:generate
// Do not use this for anything else
// Check https://www.better-auth.com/docs/concepts/cli for more information
export default betterAuth(getBaseOptions(createDb()));
