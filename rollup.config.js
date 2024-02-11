import { fileURLToPath } from 'node:url';
import { resolve, dirname } from 'node:path';

import run from '@rollup/plugin-run';
import terser from '@rollup/plugin-terser';
import commonjs from '@rollup/plugin-commonjs';
import sourcemaps from 'rollup-plugin-sourcemaps';
import includePaths from 'rollup-plugin-includepaths';
import rollupTypescript from '@rollup/plugin-typescript';

const dev = process.env.NODE_ENV != "production";
const __dirname = dirname(fileURLToPath(import.meta.url));

const config = {
	input: 'index.ts',
	sourcemaps: true,
	output: {
		file: 'dist/index.js',
		sourcemap: true,
		name: 'app',
	},
	plugins: [
		includePaths({
			include: {},
			paths: ['.'],
			external: [],
			extensions: ['.js', '.ts', '.d.ts', '.cjs'],
		}),
		commonjs({ extensions: ['.js', '.ts', '.cjs'] }),
		rollupTypescript({
			sourceMap: true,
			tsconfig: resolve(__dirname, 'tsconfig.json'),
		}),
		sourcemaps(),
		dev && run(),
		!dev && terser(),
	],
	external: [
		'zod',
		'cors',
		'dayjs',
		'bcrypt',
		'ioredis',
		'express',
		'mongoose',
		'socket.io',
		'node:http',
		'pino-http',
		'jsonwebtoken',
		'dotenv/config',
	],
};

export default config;
