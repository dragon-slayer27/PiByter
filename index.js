const Discord = require("discord.js");

require("dotenv").config();

const config = require("./config.json");

const intents = new Discord.Intents(32767);

const client = new Discord.Client({ intents });

client.on("ready", () => {
	console.log("Bot is Online!")
	client.user.setPresence({ activity: { name:"&help" } })
});

client.on("messageCreate", async message => {

    if(message.content.toLowerCase().startsWith(`${config.prefix}ping`)) {
        let pingembed = new Discord.MessageEmbed()
        .setTitle("🏓 Pong!")
        .setDescription(`**${client.ws.ping}ms** Latency!`)
        .setColor("RANDOM")
        .setFooter({
        text:`Requested by ${message.author.username}`,
        iconURL:message.author.displayAvatarURL()
        })
        .setTimestamp();
         message.channel.send({embeds: [pingembed]});
      }

      if(message.content.toLowerCase().startsWith(`${config.prefix}football`)) {
        const positions = {
			left: '_ _                   🥅🥅🥅\n_ _                   🕴️\n      \n_ _                         ⚽',
			middle: '_ _                   🥅🥅🥅\n_ _                        🕴️\n      \n_ _                         ⚽',
			right: '_ _                   🥅🥅🥅\n_ _                              🕴️\n      \n_ _                         ⚽',
		};
		let randomized = Math.floor(Math.random() * Object.keys(positions).length);
		let gameEnded = false;
		let randomPos = positions[Object.keys(positions)[randomized]];

		const componentsArray = [
			{
				type: 1,
				components: [
					{
						type: 2,
						style: 'SECONDARY',
						custom_id: 'left',
						label: 'Left',
					},
					{
						type: 2,
						style: 'PRIMARY',
						custom_id: 'middle',
						label: 'Middle',
					},
					{
						type: 2,
						style: 'SECONDARY',
						custom_id: 'right',
						label: 'Right',
					},
				],
			},
		];

		const msg = await message.channel.send({
			content: randomPos,
			components: componentsArray,
		});
		function update() {
			randomized = Math.floor(Math.random() * Object.keys(positions).length);
			randomPos = positions[Object.keys(positions)[randomized]];

			msg.edit({
				content: randomPos,
				components: componentsArray,
			});
		}
		setInterval(() => {
			if(gameEnded == false) return update();
		}, 1000);

		const filter = button => {
			return button.user.id === message.author.id;
		};
		const button = await msg.awaitMessageComponent({ filter: filter, componentType: 'BUTTON', max: 1 });

		if(button.customId !== Object.keys(positions)[randomized]) {
			gameEnded = true;
			return button.reply({ content: 'You are a professional!' });
		}
		else {
			gameEnded = true;
			return button.reply({ content: 'you lost. Next time bud!' });
		}
      }

      if(message.content.toLowerCase().startsWith(`${config.prefix}gunfight`)) {
		const opponent = message.mentions.users.first();
		const positions = {
			three: '_ _        :levitate: :point_right:      **3**        :point_left: :levitate:',
			two: '_ _        :levitate: :point_right:      **2**        :point_left: :levitate:',
			one: '_ _        :levitate: :point_right:      **1**        :point_left: :levitate:',
			go: '_ _        :levitate: :point_right:      **GO!**        :point_left: :levitate:',
			ended1: '_ _     :levitate: :point_right:      **STOP!**        :skull_crossbones: :levitate:',
			ended2: '_ _     :levitate: :skull_crossbones:      **STOP!**        :point_left: :levitate:',
		};

		const componentsArray = [
			{
				type: 1,
				components: [
					{
						type: 2,
						label: 'Shoot!',
						custom_id: 'shoot1',
						style: 'PRIMARY',
						disabled: true,
					},
					{
						type: 2,
						label: '\u200b',
						custom_id: 'id lol useless',
						style: 'SECONDARY',
						disabled: true,
					},
					{
						type: 2,
						label: 'Shoot!',
						custom_id: 'shoot2',
						style: 'DANGER',
						disabled: true,
					},
				],
			},
		];

		const msg = await message.channel.send({
			content: positions.three,
			components: componentsArray,
		});

		function countdown() {
			setTimeout(() => {
				msg.edit({
					content: positions.two,
					components: componentsArray,
				});
			}, 1000);
			setTimeout(() => {
				msg.edit({
					content: positions.one,
					components: componentsArray,
				});
			}, 2000);
			setTimeout(() => {
				componentsArray[0].components[0].disabled = false;
				componentsArray[0].components[2].disabled = false;
				msg.edit({
					content: positions.go,
					components: componentsArray,
				});
			}, 3000);
		}
		countdown();

		const filter = button => {
			return button.user.id == message.author.id || button.user.id == opponent.id;
		};

		const button = await msg.awaitMessageComponent({ filter: filter, componentType: 'BUTTON', max: 1 });

		componentsArray[0].components[0].disabled = true;
		componentsArray[0].components[2].disabled = true;

		if(button.customId === 'shoot1' && button.user.id == message.author.id) {
			msg.edit({
				content: positions.ended1,
				components: componentsArray,
			});
			return button.reply({ content: `<@${message.author.id}> won!` });
		}
		else if(button.customId === 'shoot2' && button.user.id == opponent.id) {
			msg.edit({
				content: positions.ended1,
				components: componentsArray,
			});
			return button.reply({ content: `<@${opponent.id}> won!` });
		}
      }

	  if(message.content.toLowerCase().startsWith(`${config.prefix}roadrace`)){
		const opponent = message.mentions.users.first();

		if(!opponent) return message.channel.send('Mention 2nd player when');

		const positions = {
			first: ':checkered_flag::eight_pointed_black_star::eight_pointed_black_star::eight_pointed_black_star::eight_pointed_black_star::checkered_flag:',
			second: `                              :red_car: - <@${message.author.id}>`,
			third: `                              :blue_car: - <@${opponent.id}>`,
			fourth: ':checkered_flag::eight_pointed_black_star::eight_pointed_black_star::eight_pointed_black_star::eight_pointed_black_star::checkered_flag:',
		};
		const blue = String(Math.random());
		const red = String(Math.random());

		positions.second = positions.second.split('');
		positions.third = positions.third.split('');

		const speed = 2;

		const data = { first: 30, second: 30 };

		const componentsArray = [
			{
				type: 1,
				components: [
					{
						type: 2,
						style: 'PRIMARY',
						custom_id: blue,
						emoji: { name: '🚙' },
					},
					{
						type: 2,
						style: 'DANGER',
						custom_id: red,
						emoji: { name: '🚗' },
					},
				],
			},
		];

		const msg = await message.channel.send({
			content: positions.first + '\n' + positions.second.join('') + '\n' + positions.third.join('') + '\n' + positions.fourth,
			components: componentsArray,
		});

		const filter = (button => { return button.user.id === message.author.id || button.user.id === opponent.id; });
		const game = message.channel.createMessageComponentCollector({
			filter,
			componentType: 'BUTTON',
		});

		function update(win, who) {
			if(win === true) {
				game.stop();
				componentsArray[0].components[0].disabled = true;
				componentsArray[0].components[1].disabled = true;

				message.channel.send(`gg ${who.username} won`);
			}

			msg.edit({
				content: positions.first + '\n' + positions.second.join('') + '\n' + positions.third.join('') + '\n' + positions.fourth,
				components: componentsArray,
			});
		}

		game.on('collect', async button => {
			button.deferUpdate();
			for(let i = 0; i < speed; i++) {
				if(button.customId === blue && button.user.id === opponent.id) {
					data.second--;
					if(i === speed - 1) data.second === 0 ? update(true, opponent) : update();
					positions.third.shift();
				}
				else if(button.user.id === message.author.id && button.customId === red) {
					data.first--;
					if(i === speed - 1) data.first === 0 ? update(true, message.author) : update();
					positions.second.shift();
				}
			}
		});
	  }

    if(message.content.toLowerCase().startsWith(`${config.prefix}help`)) {
            let helpembed = new Discord.MessageEmbed()
            .setTitle("Help")
            .setDescription(`**Prefix:**: ${config.prefix}`)
            .addField("**ping**", "Shows the latency of the bot.")
            .addField("**football**", "Use it to play football.")
			.addField("**gunfight**", "Use it to challenge another player to a gunfight")
			.addField("**roadrace**", "Use it to race another player")
            .setColor("RANDOM")
            .setFooter({
            text:`Requested by ${message.author.username}`,
            iconURL:message.author.displayAvatarURL()
            })
            .setTimestamp();
             message.channel.send({embeds: [helpembed]});
    }

});

client.login(process.env.token);
