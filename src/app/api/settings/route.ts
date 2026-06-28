import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import GuildSettings from '@/models/GuildSettings';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const guildId = searchParams.get('guildId');

  if (!guildId) {
    return NextResponse.json({ error: 'Missing guildId' }, { status: 400 });
  }

  try {
    await connectToDatabase();
    let settings = await GuildSettings.findOne({ guildId });
    
    if (!settings) {
      settings = await GuildSettings.create({ guildId });
    }

    return NextResponse.json(settings);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Database error' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { guildId, prefix, welcomeChannel, autoMod, logDeletedMessages } = body;

    if (!guildId) {
      return NextResponse.json({ error: 'Missing guildId' }, { status: 400 });
    }

    await connectToDatabase();
    
    const updatedSettings = await GuildSettings.findOneAndUpdate(
      { guildId },
      { prefix, welcomeChannel, autoMod, logDeletedMessages },
      { new: true, upsert: true }
    );

    return NextResponse.json(updatedSettings);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Database error' }, { status: 500 });
  }
}
