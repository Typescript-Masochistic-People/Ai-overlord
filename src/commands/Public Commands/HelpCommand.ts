import { Command } from "discord-akairo";
import { Message, MessageEmbed } from "discord.js";
import { stripIndents } from "common-tags";

export default class HelpCommand extends Command {
    public constructor() {
        super("help", {
            aliases: ["help", "commands", "cmds"],
            category: "Public Commands",
            description: {
                content: "View all commands that are on the bot",
                usage: "Help [ Command ]",
                examples: [
                    "help",
                    "help ping",
                    "help avatar"
                ]

            },
            ratelimit: 3,
            args: [
                {
                    id: "command",
                    type: "commandAlias",
                    default: null
                }
            ]
        });
    }

    public exec(message: Message, { command }: { command: Command}): Promise<Message> {
        if (command) {
            return message.channel.send(new MessageEmbed()
                .setAuthor(`help | ${command}`, this.client.user.displayAvatarURL())
                .setColor("RANDOM")
                .setDescription(stripIndents`
                    **Description:**
                    ${command.description.content || "No content provided"}

                    **Usage:**
                    ${command.description.usage || "No usage provided"}

                    **Examples**
                    ${command.description.examples ? command.description.examples.map(e => `\`${e}\``) : "No Examples Provided"}
                `)
            );
        }

        const embed = new MessageEmbed()
            .setAuthor(`Help | ${this.client.user.username}`, this.client.user.displayAvatarURL())
            .setColor("RANDOM")
            .setFooter(`${this.client.CommandHandler.prefix}help [Command] for more info on a command`)

        for (const catagory of this.handler.categories.values()) {
            if (["default"].includes(catagory.id)) continue;

            embed.addField(catagory.id, catagory
                .filter(cmd => cmd.aliases.length > 0)
                .map(cmd => `**\`${cmd}\`**`)
                .join(", ") || "No commands in this category"
            );
        }
        return message.channel.send(embed)
    }
}