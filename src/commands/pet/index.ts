import type { Command } from '../../commands.js'

const buddy = {
  type: 'local-jsx',
  name: 'pet',
  description: 'Hatch, pet, and manage your BeastCLI companion',
  immediate: true,
  argumentHint: '[status|mute|unmute|help]',
  load: () => import('./buddy.js'),
} satisfies Command

export default buddy
