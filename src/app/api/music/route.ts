import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import mongoose from 'mongoose';

const WebCommandSchema = new mongoose.Schema({
  guildId: String,
  userId: String,
  action: String,
  url: String,
  timestamp: { type: Date, default: Date.now }
});

const WebCommand = mongoose.models.WebCommand || mongoose.model('WebCommand', WebCommandSchema, 'web_commands');

export async function POST(request: Request) {
  try {
    const { guildId, action, url, userId } = await request.json();
    if (!guildId || !action) return NextResponse.json({ error: 'Missing parameters' }, { status: 400 });

    await connectToDatabase();
    await WebCommand.create({ guildId, action, url, userId });
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Database error' }, { status: 500 });
  }
}
