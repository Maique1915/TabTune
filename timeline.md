Linha do tempo
Sincroniza animações, temporizadores e funções de retorno de chamada.
As linhas do tempo são criadas usando o createTimeline()método importado do 'animejs'módulo principal:

import { createTimeline } from 'animejs';

const timeline = createTimeline(parameters);

Ou importado como um módulo independente do'animejs/timeline' 
subcaminho
:

import { createTimeline } from 'animejs/timeline';

Parâmetros
Nome	Aceita
parâmetros (opcional)	Um Objectde
Configurações de reprodução da linha do tempo
e
Retornos de chamada da linha do tempo
Devoluções
Timeline

Uma Timelineinstância expõe
métodos
Usado para adicionar animações, temporizadores, funções de retorno de chamada e rótulos.

timeline.add(target, animationParameters, position);
timeline.add(timerParameters, position);
timeline.sync(timelineB, position);
timeline.call(callbackFunction, position);
timeline.label(labelName, position);

Exemplo de código de linha do tempo

J
ava
S
script

HTML

import { createTimeline } from 'animejs';

const tl = createTimeline({ defaults: { duration: 750 } });

tl.label('start')
  .add('.square', { x: '15rem' }, 500)
  .add('.circle', { x: '15rem' }, 'start')
  .add('.triangle', { x: '15rem', rotate: '1turn' }, '<-=500');


  Linha do tempo

Desde a versão 4.0.0

Adicionar temporizadores
V4
É possível adicionar temporizadores a uma linha do tempo usando o
add()
método ou o
sync()
método.

Criação de temporizador
Cria e adiciona um temporizador diretamente à linha do tempo usando o
add()
método.

timeline.add(parameters, position);

Parâmetros
Nome	Aceita
parâmetros	Um Objectde
Configurações de reprodução do temporizador
e
Retornos de chamada do temporizador
posição (opcional)	
Posição temporal
Sincronização de temporizador
Sincroniza um temporizador existente com o
sync()
método.

timeline.sync(timer, position);

Parâmetros
Nome	Aceita
temporizador	
Temporizador
posição (opcional)	
Posição temporal
Devoluções
A própria linha do tempo

Pode ser encadeado com outros métodos de linha do tempo.

Exemplo de código para adicionar temporizadores

J
ava
S
script

HTML

import { createTimeline, createTimer, utils } from 'animejs';

const [ $timer01, $timer02, $timer03 ] = utils.$('.timer');

const timer1 = createTimer({
  duration: 1500,
  onUpdate: self => $timer01.innerHTML = self.currentTime,
});

const tl = createTimeline()
.sync(timer1)
.add({
  duration: 500,
  onUpdate: self => $timer02.innerHTML = self.currentTime,
})
.add({
  onUpdate: self => $timer03.innerHTML = self.currentTime,
  duration: 1000
});

Anterior
Próximo
Linha do tempo

Adicionar animações

Linha do tempo

Desde a versão 2.0.0

Adicionar animações
É possível adicionar animações a uma linha do tempo usando o
add()
método ou o
sync()
método.

Criação de animação
Cria e adiciona uma animação diretamente à linha do tempo com o
add()
método.
Isso permite a composição de valores de interpolação com os elementos filhos existentes na linha do tempo.

timeline.add(targets, parameters, position);

Parâmetros
Nome	Aceita
metas	
Alvos
parâmetros	Um Objectde
Propriedades animáveis
,
Parâmetros Tween
,
Configurações de reprodução
e
Retornos de chamada de animação
posição (opcional)	
Posição temporal
Sincronização de animação
Sincroniza uma animação existente com a
sync()
O método
de composição de valores de interpolação é tratado quando a animação é criada e não afetará os elementos filhos existentes na linha do tempo quando forem adicionados.

const animation = animate(target, { x: 100 });

timeline.sync(animation, position);

Parâmetros
Nome	Aceita
animação	
Animação
posição (opcional)	
Posição temporal
Devoluções
A própria linha do tempo

Pode ser encadeado com outros métodos de linha do tempo.

Exemplo de código para adicionar animações

J
ava
S
script

HTML

import { createTimeline, animate } from 'animejs';

const circleAnimation = animate('.circle', {
  x: '15rem'
});

const tl = createTimeline()
.sync(circleAnimation)
.add('.triangle', {
  x: '15rem',
  rotate: '1turn',
  duration: 500,
  alternate: true,
  loop: 2,
})
.add('.square', {
  x: '15rem',
});

