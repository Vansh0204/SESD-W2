#!/usr/bin/env node
import 'dotenv/config';
import { App } from './app';

const app = new App();
app.run(process.argv);
