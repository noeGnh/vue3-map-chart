import type { Component } from 'vue'

export interface Options {
  name?: string
  maps?: Record<string, Component>
}
