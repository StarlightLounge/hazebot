import mongoose from 'mongoose';

const GuildSettingsSchema = new mongoose.Schema({
  guildId: { type: String, required: true, unique: true },
  prefix: { type: String, default: '!' },
  welcomeChannel: { type: String, default: 'general-chat' },
  autoMod: { type: String, default: 'Relaxed (Block severe words)' },
  logDeletedMessages: { type: Boolean, default: true },
});

export default mongoose.models.GuildSettings || mongoose.model('GuildSettings', GuildSettingsSchema);
