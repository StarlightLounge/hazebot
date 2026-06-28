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

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const guildId = searchParams.get('guildId');
    if (!guildId) return NextResponse.json({ error: 'Missing guildId' }, { status: 400 });

    await connectToDatabase();
    const db = mongoose.connection.db;
    if (!db) return NextResponse.json({ error: 'Database connection failed' }, { status: 500 });

    const guild = await db.collection('guilds').findOne({ guild_id: guildId });
    return NextResponse.json({ musicState: guild?.music_state || null });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Database error' }, { status: 500 });
  }
}
