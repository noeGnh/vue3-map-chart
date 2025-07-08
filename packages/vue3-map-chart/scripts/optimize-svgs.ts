import fs from 'fs'
import path from 'path'
import { Config, optimize, Output } from 'svgo'

import svgoConfig from '../svgo.config.mjs'

// Target directory (customize this path)
const targetDir: string = '../assets/maps'

/**
 * Recursively optimizes all SVGs in a directory and its subdirectories.
 */
function optimizeSvgsInDirectory(dir: string): void {
  const files: string[] = fs.readdirSync(dir)

  files.forEach((file: string) => {
    const fullPath: string = path.join(dir, file)
    const stat: fs.Stats = fs.statSync(fullPath)

    if (stat.isDirectory()) {
      optimizeSvgsInDirectory(fullPath) // Recurse into subdirectories
    } else if (path.extname(file).toLowerCase() === '.svg') {
      optimizeSvgFile(fullPath) // Optimize SVG files
    }
  })
}

/**
 * Optimizes a single SVG file.
 */
function optimizeSvgFile(filePath: string): void {
  try {
    const svgContent: string = fs.readFileSync(filePath, 'utf8')
    const result: Output = optimize(svgContent, svgoConfig as Config)

    fs.writeFileSync(filePath, result.data)
    console.log(`Optimized: ${filePath}`)
  } catch (error) {
    console.error(`Failed to process ${filePath}:`, error)
  }
}

// Execute
optimizeSvgsInDirectory(targetDir)
console.log('SVG optimization complete!')
