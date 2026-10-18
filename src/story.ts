/** Edit the dialogue here. Each step is one click in the game. */
export type Character = 'vendela' | 'amanda' | 'fuckboy' | 'perv' | 'creep' | 'kaarija' | 'erika' | 'friend' | 'officiant' | 'women' | 'mystery'
export type Scene = 'bar' | 'dance' | 'outside' | 'wedding'
export type Step = {speaker?: Character; text: string; scene?: Scene; chapter?: string; left?: Character; right?: Character; mood?: string; effect?: 'shake'|'flash'|'green'|'pink'; action?: 'boss1'|'boss2'|'boss3'|'proposal'|'marriage'|'ending'; special?: 'fatality'|'wedding'|'ending'; note?: string}
const n = (text: string, extra: Partial<Step> = {}): Step => ({text, ...extra})
const d = (speaker: Character, text: string, extra: Partial<Step> = {}): Step => ({speaker,text,...extra})

export const chapters: {title: string; scene: Scene; steps: Step[]}[] = [
 {title:'01 / MEN ARE DISAPPOINTING',scene:'bar',steps:[
 n('Saturday night. Vendela has come to Nyköping to celebrate her birthday with her best friend, Amanda.',{left:'vendela',right:'amanda'}),
 d('amanda',"I'm just going to the bathroom. Don't do anything stupid."),d('vendela','No promises.'),
 n('Vendela heads to the bar to order a drink. Two guys are standing next to her.',{right:'fuckboy'}),
 d('fuckboy','I finally got rid of that girl I was seeing.'),d('friend','What happened?'),
 d('fuckboy','Nothing. I just wanted to fuck her. She actually thought I liked her.'),
 d('friend',"That's pretty fucked up, dude."),d('fuckboy',"Relax. She wasn't even that hot."),
 n('Vendela turns and looks at him in disgust.'),d('fuckboy','What the fuck are you looking at?'),d('vendela','Unfortunately, you.'),
 n('The Fuckboy gets visibly annoyed.',{action:'boss1'})]},
 {title:'02 / PERSONAL SPACE INVADERS',scene:'dance',steps:[
 n('Vendela is finally enjoying herself on the dance floor when a guy approaches her.',{left:'vendela',right:'perv'}),
 d('perv','Hey, beautiful. Wanna dance?'),d('vendela','No, thanks.'),d('perv',"Come on, don't be shy."),
 n('He moves closer and puts his hand on her waist.'),n('Vendela immediately pushes his hand away.'),
 d('vendela',"Don't fucking touch me."),d('perv',"Jesus, relax. It's a compliment."),
 n('Vendela stares at him in disbelief.'),d('vendela','And that was a warning.'),
 n('He rolls his eyes.'),d('perv','Whatever, bitch.',{action:'boss2'})]},
 {title:'03 / THE FINAL RED FLAG',scene:'bar',steps:[
 n('After dealing with yet another asshole, Vendela heads back to the bar.',{left:'vendela',right:'creep'}),
 n('Suddenly, she spots a familiar face across the room.'),d('vendela',"Oh, you've got to be fucking kidding me."),
 n('She walks straight up to him.'),d('vendela',"Well, if it isn't the biggest fucking creep on the internet."),
 d('creep','Excuse me? Do I know you?'),d('vendela','No, but I know all about you.'),
 d('creep','What the fuck is that supposed to mean?'),
 d('vendela','You really thought rating women online was a normal fucking thing to do?'),
 d('creep','What? I can post whatever the fuck I want.'),
 d('vendela',"And I can tell you you're a disgusting fucking pig."),
 d('creep','Who the fuck do you think you are?'),n('Vendela smiles.'),
 d('vendela','Your worst fucking nightmare.',{effect:'flash',action:'boss3'})]},
 {title:'04 / THE GREEN PRINCE',scene:'outside',steps:[
 n('After surviving three of the worst men imaginable, Vendela finally steps outside for some fresh air.',{left:'vendela',right:undefined}),
 n('She takes a deep breath.'),d('vendela','Are all men just horrible fucking idiots?'),
 n('Silence.'),d('mystery','Cha... cha cha...'),n('Vendela looks around.'),d('vendela','...What?'),
 d('mystery','CHA CHA CHA!',{effect:'green'}),n('A mysterious green light begins to glow across the street.',{effect:'green'}),
 n('Vendela turns around.',{right:'kaarija'}),n('Standing beneath the neon lights is Käärijä, wearing his iconic green bolero.',{effect:'green'}),
 d('vendela','Oh my fucking God.'),d('kaarija','Hello!'),d('vendela','Käärijä?! What the fuck are you doing in Nyköping?'),
 d('kaarija','Looking for love.'),d('vendela','...In Nyköping?'),d('kaarija','Yes.'),
 n('Vendela stares at him.'),d('kaarija','You want to dance?'),d('vendela','With you? Fuck yes.'),
 n('LOVE AT FIRST CHA CHA CHA',{special:'wedding'}),n('Käärijä takes her hand.'),
 d('kaarija','I think I love you.'),d('vendela','We literally just met.'),
 d('kaarija','Yes. Marry me?'),n('Vendela blinks.'),d('vendela','...What?'),
 d('kaarija','Marry me.',{action:'proposal'})]},
 {title:'05 / HERE COMES THE BRIDE',scene:'wedding',steps:[
 n('Wedding bells ring.',{left:'vendela',right:'kaarija'}),
 n('Somehow, Vendela is now standing at the altar in a wedding dress.'),
 n('Käärijä is waiting for her in his neon green bolero.'),
 n('Amanda suddenly appears beside her, dressed as the maid of honor.',{right:'amanda'}),
 d('amanda',"I leave you alone for FIVE MINUTES and you're getting married?!"),
 d('vendela','Apparently.'),d('amanda','To Käärijä?'),d('vendela','Yep.'),d('amanda','Honestly, fair.'),
 n('The wedding ceremony begins.',{right:'kaarija'}),
 d('officiant','Do you, Vendela, take Käärijä to be your lawfully wedded husband?'),
 d('vendela','Fuck yes.'),d('officiant','And do you, Käärijä—'),d('kaarija','YES!'),
 d('officiant','Well then. If anyone objects to this marriage, speak now or forever hold your peace.'),
 n('Silence.'),n('Suddenly, the church doors BURST open.',{effect:'shake'}),
 d('mystery','ICH KOMME!',{effect:'pink'}),n('Everyone turns around.',{right:'erika'}),
 n('Erika Vikman stands in the doorway.'),d('erika','STOP THE WEDDING!'),
 d('vendela','ERIKA VIKMAN?!'),d('erika',"You can't marry him..."),
 n('A dramatic pause.'),d('erika','...without me.'),
 n('Vendela looks at Käärijä.'),n('Käärijä looks at Erika.'),
 d('kaarija','Three is better than two. More cha cha cha.'),
 d('amanda',"Oh my God. She's collecting Finns.",{right:'amanda',action:'marriage'})]}
]

export type Choice = {label:string; steps:Step[]}
export const fights: Record<'boss1'|'boss2'|'boss3', {title:string; enemy:Character; choices:Choice[]; after:Step[]}> = {
 boss1:{title:'THE FUCKBOY',enemy:'fuckboy',choices:[
 {label:'MEAN / DRINK TO THE FACE',steps:[d('vendela','Shut the fuck up.'),n('Vendela throws her drink straight into his face.',{effect:'shake'}),n('SPLASH!',{effect:'flash'}),d('fuckboy','WHAT THE FUCK?!'),d('vendela','Oops.'),n('FATALITY!',{special:'fatality'})]},
 {label:'BRUTAL / BALL BUSTER',steps:[n('Vendela slowly walks towards him.'),d('fuckboy','What the fuck do you think you\'re doing?'),d('vendela','Doing women everywhere a favour.'),n('She kicks him between the legs.',{effect:'shake'}),n('WHOOSH!',{effect:'flash'}),d('fuckboy','AAAAAAAH!'),n('FATALITY!',{special:'fatality'})]}],
 after:[d('vendela','Fuck this. I need to dance.')]},
 boss2:{title:'THE PERV',enemy:'perv',choices:[
 {label:'MEAN / BITCH SLAP',steps:[n('Vendela slaps him across the face.',{effect:'shake'}),n('He spins around and crashes onto the dance floor.'),d('vendela',"I said don't fucking touch me."),n('FATALITY!',{special:'fatality'})]},
 {label:"BRUTAL / SAY YOU'RE SORRY!",steps:[n('Vendela takes off her necklace and walks towards him.'),n('She wraps it around his neck and pulls him backwards.',{effect:'shake'}),d('vendela',"Say you're fucking sorry!"),d('perv',"I'M SORRY! I'M FUCKING SORRY!"),n('Vendela lets go.'),d('vendela','Good boy.'),n('FATALITY!',{special:'fatality'})]}],
 after:[d('vendela','Can I have ONE normal fucking night?')]},
 boss3:{title:'THE CREEP',enemy:'creep',choices:[
 {label:'MEAN / WALK OF SHAME',steps:[d('vendela','HEY! EVERYONE! THIS IS THE CREEP!'),n('The music stops.'),n('Every woman in the bar slowly turns towards him.'),d('creep','...What the fuck?'),d('women','SHAME! SHAME! SHAME!',{effect:'shake'}),n('The chanting gets louder.'),d('creep','STOP IT!'),n('He desperately tries to escape.'),d('vendela',"Aww. Don't like being judged?"),n('FINAL FATALITY!',{special:'fatality'})]},
 {label:'BRUTAL / FAMILY REUNION',steps:[d('vendela','Oh, by the way. I just sent your X account to your entire family.'),d('creep','...You WHAT?!'),d('vendela','Your mom says hi.'),n('His face turns pale.'),n('His phone starts vibrating uncontrollably.',{effect:'shake'}),n('MOM CALLING... 📞'),n('DAD CALLING... 📞'),n('GRANDMA CALLING... 📞'),n('FINAL FATALITY!',{special:'fatality'})]}],
 after:[d('vendela','I need some fucking air.')]}
}
export const displayNames:Record<Character,string> = {vendela:'VENDELA',amanda:'AMANDA',fuckboy:'THE FUCKBOY',perv:'THE PERV',creep:'THE CREEP',kaarija:'KÄÄRIJÄ',erika:'ERIKA',friend:'HIS FRIEND',officiant:'OFFICIANT',women:'WOMEN',mystery:'???'}
