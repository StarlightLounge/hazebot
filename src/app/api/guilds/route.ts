import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]/route';

export async function GET() {
  const session = await getServerSession(authOptions);
  
  // @ts-ignore
  if (!session || !session.accessToken) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    // @ts-ignore
    const response = await fetch('https://discord.com/api/users/@me/guilds', {
      headers: {
        // @ts-ignore
        Authorization: `Bearer ${session.accessToken}`,
      },
    });

    if (!response.ok) {
      return NextResponse.json({ error: 'Failed to fetch guilds' }, { status: response.status });
    }

    const guilds = await response.json();

    // Filter guilds where user is owner OR has MANAGE_GUILD (0x20) or ADMINISTRATOR (0x8)
    const adminGuilds = guilds.filter((guild: any) => {
      const permissions = BigInt(guild.permissions);
      const isOwner = guild.owner === true;
      const hasManageGuild = (permissions & BigInt(0x20)) === BigInt(0x20);
      const hasAdmin = (permissions & BigInt(0x8)) === BigInt(0x8);
      
      return isOwner || hasManageGuild || hasAdmin;
    });

    // Format the response
    const formattedGuilds = adminGuilds.map((guild: any) => ({
      id: guild.id,
      name: guild.name,
      icon: guild.icon ? `https://cdn.discordapp.com/icons/${guild.id}/${guild.icon}.png` : null,
      // For now, we mock `hasBot` since we don't have a database of configured bots yet
      hasBot: Math.random() > 0.5, 
    }));

    return NextResponse.json(formattedGuilds);
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
