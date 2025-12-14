anime.js logo v4




Animação
Anima os valores das propriedades dos elementos selecionados, com uma ampla gama de parâmetros, funções de retorno de chamada e métodos.
As animações são criadas usando o animate()método importado do 'animejs'módulo principal:

import { animate } from 'animejs';

const animation = animate(targets, parameters);

Ou importado como um módulo independente do'animejs/animation' 
subcaminho
:

import { animate } from 'animejs/animation';

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
Devoluções
JSAnimation

Animações com tecnologia WAAPI
O Anime.js fornece uma versão mais leve (3 KB) do animate()método (10 KB) com a tecnologia do
API de animação web
.

import { waapi } from 'animejs';

const animation = waapi.animate(targets, parameters);

A versão WAAPI possui menos recursos no geral, mas abrange a maior parte da API básica.

Para saber mais sobre quando usar a versão WAAPI e suas possíveis desvantagens, consulte o
Guia da API de Animações Web
.

Devoluções
WAAPIAnimation

Os recursos disponíveis apenas na versão JavaScript são indicados com um (JSOs recursos específicos do WAAPI e do crachá são indicados com um (WAAPI) distintivo

Exemplo de código de animação


CSS

import { animate, stagger, splitText } from 'animejs';

const { chars } = splitText('h2', { words: false, chars: true });

animate(chars, {
  // Property keyframes
  y: [
    { to: '-2.75rem', ease: 'outExpo', duration: 600 },
    { to: 0, ease: 'outBounce', duration: 800, delay: 100 }
  ],
  // Property specific parameters
  rotate: {
    from: '-1turn',
    delay: 0
  },
  delay: stagger(50),
  ease: 'inOutCirc',
  loopDelay: 1000,
  loop: true
});

Nesta seção
Alvos
Propriedades animáveis
tipos de valor entre
Parâmetros Tween
Quadros-chave
Configurações de reprodução
Retornos de chamada
Métodos
Propriedades
Anterior
Próximo
Propriedades do temporizador

Alvos
Anime.js só é possível graças aos nossos incríveis patrocinadores:

Ice Open Network
Ice Open Network

Warp
Warp

Juspay
Juspay

Meta de financiamento
20%
Rodrigo Sales




Começando
Temporizador
Animação
Alvos
Seletor CSS
Elementos DOM
Objetos JavaScript JS
Conjunto de alvos
Propriedades animáveis
tipos de valor entre
Parâmetros Tween
Quadros-chave
Conf

Animação

Desde a versão 4.0.0

Alvos
Especifique os elementos aos quais as alterações de valor da propriedade serão aplicadas.
Os alvos da animação são definidos no primeiro argumento da animate()função.

animate(
┌────────────┐
│ '.square', ├─ Targets
└────────────┘
{
  translateX: 100,
  scale: 2,
  opacity: .5,
  duration: 400,
  delay: 250,
  ease: 'out(3)',
  loop: 3,
  alternate: true,
  autoplay: false,
  onBegin: () => {},
  onLoop: () => {},
  onUpdate: () => {},
});
Nesta seção
Seletor CSS
Elementos DOM
Objetos JavaScript
Conjunto de alvos
Anterior
Próximo
Animação

Seletor CSS
Anime.js só é possível graças aos nossos incríveis patrocinadores:

Ice Open Network
Ice Open Network

Warp
Warp

Juspay
Juspay

Meta de financiamento
20%
Rodrigo Sales




Começando
Temporizador
Animação
Alvos
Seletor CSS
Elementos DOM
Objetos JavaScript JS
Conjunto de alvos
Propriedades animáveis
tipos de valor entre
Parâmetros Tween
Quadros-chave
Conf

Animação
  
Alvos

Desde a versão 1.0.0

Seletor CSS
Seleciona um ou mais elementos DOM usando um seletor CSS.

Aceita
Qualquer um Stringaceito pordocument.querySelectorAll()

Exemplo de código de seletor CSS


import { animate } from 'animejs';

animate('.square', { x: '17rem' });
animate('#css-selector-id', { rotate: '1turn' });
animate('.row:nth-child(3) .square', { scale: [1, .5, 1] });

Anterior
Próximo
Alvos

Elementos DOM
Anime.js só é possível graças aos nossos incríveis patrocinadores:

Rede Aberta de Gelo
Rede Aberta de Gelo

Urdidura
Urdidura

Juspay
Juspay

Meta de financiamento
20%
Rodrigo Vendasempreendedor4lyf
Jules
LambdaTest
Justin Hall
Dan Milward
Aaron Kenton
Exercício físico
Aaron Iker
Andoni Enriquez



Começando
Temporizador
Animação
Alvos
Seletor CSS
Elementos DOM
Objetos JavaScript JS
Conjunto de alvos
Propriedades animáveis
tipos de valor entre
Parâmetros Tween
Quadros-chave
Conf

Animação
  
Alvos

Desde a versão 1.0.0

Elementos DOM
Seleciona um ou mais elementos DOM.

Aceita
HTMLElement
SVGElement
SVGGeometryElement
NodeList
Exemplo de código de elementos DOM


import { animate } from 'animejs';

const $demo = document.querySelector('#selector-demo');
const $squares = $demo.querySelectorAll('.square');

animate($demo, { scale: .75 });
animate($squares, { x: '23rem' });

Anterior
Próximo
Seletor CSS

Objetos JavaScript
Anime.js só é possível graças aos nossos incríveis patrocinadores:

Rede Aberta de Gelo
Rede Aberta de Gelo

Urdidura
Urdidura

Juspay
Juspay

Meta de financiamento
20%
Rodrigo Vendasempreendedor4lyf
Jules
LambdaTest
Justin Hall
Dan Milward
Aaron Kenton
Exercício físico
Aaron Iker
Andoni Enriquez





Desde a versão 1.0.0

Propriedades animáveis
Defina quais propriedades do
Alvos
Pode ser animado.
As propriedades animáveis ​​são definidas nos parâmetros Objectda animate()função.

animate('.square', {
┌──────────────────┐
│ translateX: 100, │
│ scale: 2,        ├─ Animatable Properties
│ opacity: .5,     │
└──────────────────┘
  duration: 400,
  delay: 250,
  ease: 'out(3)',
  loop: 3,
  alternate: true,
  autoplay: false,
  onBegin: () => {},
  onLoop: () => {},
  onUpdate: () => {},
});
Nesta seção
Propriedades CSS
Transformações CSS
Variáveis ​​CSS
Propriedades de objetos JS
Atributos HTML
Atributos SVG
Anterior
Próximo
Conjunto de alvos

Propriedades CSS
Anime.js só é possível graças aos nossos incríveis patrocinadores:

Ice Open Network
Ice Open Network

Warp
Warp

Juspay
Juspay

Meta de financiamento
20%
Rodrigo Sales





  
Propriedades animáveis

Desde a versão 1.0.0

Propriedades CSS
Qualquer propriedade numérica e de cor em CSS pode ser animada.
Propriedades que contenham um hífen em seu nome, como background-color, devem ser convertidas para camel case ( backgroundColor), ou escritas como um String( 'background-color').

A maioria das propriedades CSS pode causar alterações no layout ou repintura, resultando em animações instáveis. Para obter animações mais suaves, priorize sempre a opacidade e
Transformações CSS
tanto quanto possível.

Exemplo de código de propriedades CSS


import { animate } from 'animejs';

animate('.square', {
  left: 'calc(7.75rem * 2)',
  borderRadius: 64,
  'background-color': '#F9F640',
  filter: 'blur(5px)',
});

Anterior
Próximo
Propriedades animáveis

Transformações CSS
Anime.js só é possível graças aos nossos incríveis patrocinadores:

Rede Aberta de Gelo
Rede Aberta de Gelo

Urdidura
Urdidura

Juspay
Juspay

Meta de financiamento
20%
Rodrigo Vendasempreendedor4lyf
Jules
LambdaTest
Justin Hall
Dan Milward
Aaron Kenton
Exercício físico
Aaron Iker
Andoni Enriquez




  
Propriedades animáveis

Desde a versão 1.0.0

Transformações CSS
A transformpropriedade CSS pode ser animada especificando propriedades individuais diretamente no objeto de parâmetro com ambosJSeWAAPI animate()versões.

Isso permite um maior nível de controle sobre como animar propriedades de transformação individuais, oferecendo mais flexibilidade do que animações CSS ou WAAPI nativa.

OJS animate()O método não analisa transformações declaradas a partir de uma declaração de estilo CSS, e as propriedades de transformação devem ser definidas diretamente nos estilos embutidos do elemento. Você pode usar o recurso integrado.
utils.set()
Função para definir independentemente os valores de transformação antes de animar um elemento e definir a ordem em que devem ser definidos.

Para animar a transformpropriedade diretamente, recomenda-se usar oWAAPImétodo energizado .waapi.animate()

O indivíduo se transforma comWAAPIFunciona apenas em navegadores que suportam
CSS.registerProperty(propertyDefinition)
e, como alternativa, não exibir animações.

Propriedades válidas de transformações CSS individuais
Nome	Taquigrafia	Valor padrão	Unidade padrão
traduzirX	x	'0px'	'px'
traduzirY	y	'0px'	'px'
traduzirZ	z	'0px'	'px'
girar	—	'0deg'	'deg'
girarX	—	'0deg'	'deg'
girarY	—	'0deg'	'deg'
girarZ	—	'0deg'	'deg'
escala	—	'1'	—
escalaX	—	'1'	—
escalaY	—	'1'	—
escalaZ	—	'1'	—
distorção	—	'0deg'	'deg'
skewX	—	'0deg'	'deg'
distorcido	—	'0deg'	'deg'
perspectiva	—	'0px'	'px'
Exemplo de código de transformações CSS


import { animate, waapi } from 'animejs';

animate('.square', {
  x: '15rem', // TranslateX shorthand
  scale: 1.25,
  skew: -45,
  rotate: '1turn',
});

// the WAAPI version is recommanded if you want to animate the transform property directly
waapi.animate('.square', {
  transform: 'translateX(15rem) scale(1.25) skew(-45deg) rotate(1turn)',
});

Anterior
Próximo
Propriedades CSS

Variáveis ​​CSS
Anime.js só é possível graças aos nossos incríveis patrocinadores:

Ice Open Network
Ice Open Network

Warp
Warp

Juspay
Juspay

Meta de financiamento
20%
Rodrigo Sales





  
Propriedades animáveis

Desde a versão 4.0.0

Variáveis ​​CSS
V4
JS
Variáveis ​​CSS com valores numéricos ou de cor podem
 ser animadas passando diretamente o nome da variável como uma string para os parâmetros de animação.
Essa abordagem também permite a animação de propriedades definidas em pseudo-elementos como `<div>` ::aftere ` ::before<span>`, que de outra forma seriam inacessíveis via JavaScript.

Para animar as propriedades das variáveis ​​CSS com oWAAPIPara usar um método energizado , você precisa utilizar waapi.animate()
CSS.registerProperty(propertyDefinition)
Caso contrário, o sistema volta a não exibir animações.

Exemplo de código de variáveis ​​CSS


CSS

import { animate, utils } from 'animejs';

// Assign the CSS variables to the properties of the animated elements
utils.set('.square', {
  '--radius': '4px',
  '--x': '0rem',
  '--pseudo-el-after-scale': '1', // applied to the pseudo element "::after"
  // Using a function prevents the variables from being converted
  borderRadius: () => 'var(--radius)',
  translateX: () => 'var(--x)',
});

// Animate the values of the CSS variables
animate('.square', {
  '--radius': '20px',
  '--x': '16.5rem',
  '--pseudo-el-after-scale': '1.55' // Animates the ":after" pseudo element of the element
});

Anterior
Próximo
Transformações CSS

Propriedades de objetos JavaScript
Anime.js só é possível graças aos nossos incríveis patrocinadores:

Ice Open Network
Ice Open Network

Warp
Warp

Juspay
Juspay

Meta de financiamento
20%
Rodrigo Sales




HTML

import { animate, utils } from 'animejs';

animate('input', {
  value: 1000, // animate the input "value" attribute
  alternate: true,
  loop: true,
  modifier: utils.round(0),
});

Anterior
Próximo
Propriedades de objetos JavaScript

Atributos SVG
Anime.js só é possível graças aos nossos incríveis patrocinadores:

Rede Aberta de Gelo
Rede Aberta de Gelo

Urdidura
Urdidura

Juspay
Juspay

Meta de financiamento
20%
Rodrigo Vendasempreendedor4lyf
Jules
LambdaTest
Justin Hall
Dan Milward
Aaron Kenton
Exercício físico
Aaron Iker
Andoni Enriquez


Desde a versão 1.0.0

tipos de valor entre
Especifique os valores inicial e final que definem a animação das propriedades animáveis.
Os valores de animação são atribuídos a
Propriedades animáveis
e aceitam uma ampla variedade de sintaxes.

animate('.square', {
  x: '6rem', ─────────────────┐
  y: $el => $el.dataset.y, ───┤
  scale: '+=.25', ────────────┼─ Tween Values
  opacity: {                  │
    from: .4, ────────────────┘
  },
});
Nesta seção
Numérico
Conversão de unidades
Relativo
Cor
Função de cor
Variável CSS
Baseado em funções
Anterior
Próximo
Atributos SVG

Valor numérico
Anime.js só é possível graças aos nossos incríveis patrocinadores:

Ice Open Network
Ice Open Network

Warp
Warp

Juspay
Juspay

Meta de financiamento
20%
Rodrigo Sales


  
tipos de valor entre

Desde a versão 1.0.0

Valor numérico
Especifica o valor numérico da propriedade animada, passando um `a` Numberou um `b` Stringcontendo pelo menos um `a` Number.

Se nenhuma unidade for especificada para propriedades que esperam uma unidade, como widthpor exemplo, a animação resultante usará a unidade padrão do navegador.

animate(target, { width: 100 }); // Defaults to px

Aceita
Number
String
Se uma unidade específica já tiver sido especificada, aJS animate()O método pode herdar unidades previamente definidas e o próximo conjunto de valores sem uma unidade na mesma propriedade de destino herda a unidade previamente definida.

animate(target, { width: '50%' }); // Uses '%'
animate(target, { width: 75 });    // Inherits '%' -> '75%'

OWAAPI animate()O método recorre automaticamente apenas às 'px'seguintes propriedades:

- x / translateX
- y / translateY
- z / translateZ
- perspective
- top
- right
- bottom
- left
- width
- height
- margin
- padding
- borderWidth
- borderRadius
- fontSize

Exemplo de código de valor numérico


import { waapi } from 'animejs';

waapi.animate('.square', {
  x: 240, //  -> 240px
  width: 75, // -> 75px
  rotate: '.75turn',
});

Anterior
Próximo
tipos de valor entre

Valor de conversão de unidade
Anime.js só é possível graças aos nossos incríveis patrocinadores:

Ice Open Network
Ice Open Network

Warp
Warp

Juspay
Juspay

Meta de financiamento
20%
Rodrigo Sales


  
tipos de valor entre

Desde a versão 2.0.0

Valor de conversão de unidade
Converte e anima para um valor com uma unidade diferente da unidade padrão ou atualmente em uso.

Ao usar oJS animate()No entanto, as conversões de unidades podem, por vezes, produzir resultados inesperados, dependendo do tipo de unidade e das propriedades animadas utilizadas.
Para resultados mais previsíveis, recomenda-se definir a unidade fora da animação.
utils.set()
e então animar para a unidade atual.

Ou simplesmente use oWAAPI animate()método.

Aceita
String

Exemplo de código de valor de conversão de unidades


import { animate, utils } from 'animejs';

animate('.square', {
  width: '25%', // from '48px' to '25%',
  x: '15rem', // from '0px' to '15rem',
  rotate: '.75turn', // from `0deg` to '.75turn',
});

Anterior
Próximo
Valor numérico

Valor relativo
Anime.js só é possível graças aos nossos incríveis patrocinadores:

Ice Open Network
Ice Open Network

Warp
Warp

Juspay
Juspay

Meta de financiamento
20%
Rodrigo Sales


  
tipos de valor entre

Desde a versão 2.0.0

Valor relativo
JS
Adiciona, subtrai ou multiplica o valor alvo atual por um valor especificado.

Aceita
Prefixo	Efeito	Exemplos
'+='	Adicionar	'+=45'|'+=45px'
'-='	Subtrai	'-=45'|'-=45deg'
'*='	Multiplicar	'*=.5'
Exemplo de código de valor relativo


import { animate, utils } from 'animejs';

const [ $clock ] = utils.$('.clock');
const [ $add ] = utils.$('.add');
const [ $sub ] = utils.$('.sub');
const [ $mul ] = utils.$('.mul');

const add = () => animate($clock, { rotate: '+=90' });
const sub = () => animate($clock, { rotate: '-=90' });
const mul = () => animate($clock, { rotate: '*=.5' });

$add.addEventListener('click', add);
$sub.addEventListener('click', sub);
$mul.addEventListener('click', mul);

Anterior
Próximo
Valor de conversão de unidade

Valor da cor
Anime.js só é possível graças aos nossos incríveis patrocinadores:

Ice Open Network
Ice Open Network

Warp
Warp

Juspay
Juspay

Meta de financiamento
20%
Rodrigo Sales


  
tipos de valor entre

Desde a versão 1.0.0

Valor da cor
Os valores de cor nos seguintes formatos podem ser analisados ​​e usados ​​como valores para propriedades de cor animáveis.

Aceita
Formatar	Sintaxe
HEX	'#F44'|'#FF4444'
HEXA	'#F443'|'#FF444433'
RGB	'rgb(255, 168, 40)'
RGBA	'rgba(255, 168, 40, .2)'
HSL	'hsl(255, 168, 40)'
HSLA	'hsla(255, 168, 40, .2)'
Nome da stringWAAPI	'red'|'aqua'
Exemplo de código de valor de cor


CSS

import { animate } from 'animejs';

animate('.hex',  {
  background: '#FF4B4B',
});

animate('.rgb',  {
  background: 'rgb(255, 168, 40)',
});

animate('.hsl',  {
  background: 'hsl(44, 100%, 59%)',
});

animate('.hexa', {
  background: '#FF4B4B33',
});

animate('.rgba', {
  background: 'rgba(255, 168, 40, .2)',
});

animate('.hsla', {
  background: 'hsla(44, 100%, 59%, .2)',
});

Anterior
Próximo
Valor relativo

valor da função de cor
Anime.js só é possível graças aos nossos incríveis patrocinadores:

Ice Open Network
Ice Open Network

Warp
Warp

Juspay
Juspay

Meta de financiamento
20%
Rodrigo Sales


  
tipos de valor entre

Desde a versão 4.0.0

valor da função de cor
WAAPI
O CSS
color()
A função pode ser animada com oWAAPI animate()método.

Aceita
Qualquer
sintaxe de espaço de cores CSS válida
é suportado

Exemplo de código de valor da função de cor


CSS

import { waapi } from 'animejs';

waapi.animate('.circle',  {
  backgroundColor: 'color(display-p3 1.0 0.267 0.267 / 1.0)',
});

Anterior
Próximo
Valor da cor

Variável CSS
Anime.js só é possível graças aos nossos incríveis patrocinadores:

Rede Aberta de Gelo
Rede Aberta de Gelo

Urdidura
Urdidura

Juspay
Juspay

Meta de financiamento
20%
Rodrigo Vendasempreendedor4lyf
Jules
LambdaTest
Justin Hall
Dan Milward
Aaron Kenton
Exercício físico
Aaron Iker
Andoni Enriquez

  
tipos de valor entre

Desde a versão 4.2.0

Variável CSS
As variáveis ​​CSS podem ser usadas como valores de animação simplesmente passando o nome da variável com a 'var(--my-value)'sintaxe.

OJS animate()A versão precisa calcular a variável para animar seu valor. Isso significa que a animação não refletirá o novo valor se a variável for atualizada separadamente. Para atualizar uma variável CSS em umJSAnimação, você pode chamar
.refresh()
.

target.style.setProperty('--x', '100px');
// Animate x to 100px
const anim = animate(target, { x: 'var(--x)' });
target.style.setProperty('--x', '200px');
// Restart, and refresh the value to animate x to 200px
anim.restart().refresh()

Aceita
Variável CSS
 String

Exemplo de código de variável CSS


CSS

import { waapi, animate, stagger } from 'animejs';

waapi.animate('.square',  {
  rotate: 'var(--rotation)',
  borderColor: ['var(--hex-orange-1)', 'var(--hex-red-1)'],
  duration: 500,
  delay: stagger(100),
  loop: true,
});

animate('.square',  {
  scale: 'var(--scale)',
  background: ['var(--hex-red-1)', 'var(--hex-orange-1)'],
  duration: 500,
  delay: stagger(100),
  loop: true,
  alternate: true,
});

Anterior
Próximo
valor da função de cor

Valor baseado em função
Anime.js só é possível graças aos nossos incríveis patrocinadores:

Ice Open Network
Ice Open Network

Warp
Warp

Juspay
Juspay

Meta de financiamento
20%
Rodrigo Sales


  
tipos de valor entre

Desde a versão 1.0.0

Valor baseado em função
Define valores diferentes para cada alvo de uma animação com múltiplos alvos, usando um Functionvalor como parâmetro.

Os valores baseados em funções podem ser recalculados sem a necessidade de criar uma nova animação usando o
animation.refresh()
método.

Aceita
Um modelo Functioncom os seguintes parâmetros:

animate(targets, {
  x: (target, index, length) => target.dataset.value * (length - index),
});

Parâmetros
Nome	Descrição
alvo	O elemento alvo animado atual
índice	O índice do elemento alvo atual
comprimento	O número total de alvos animados da animação
Deve ser devolvido
Valor Tween
Parâmetros Tween
Exemplo de código de valor baseado em função


import { animate, utils } from 'animejs';

animate('.square', {
  x: $el => /** @type {HTMLElement} */($el).getAttribute('data-x'),
  y: (_, i) => 50 + (-50 * i),
  scale: (_, i, l) => (l - i) * .75,
  rotate: () => utils.random(-360, 360),
  borderRadius: () => `+=${utils.random(0, 8)}`,
  duration: () => utils.random(1200, 1800),
  delay: () => utils.random(0, 400),
  ease: 'outElastic(1, .5)',
});

Anterior
Próximo
Variável CSS

Parâmetros Tween
Anime.js só é possível graças aos nossos incríveis patrocinadores:

Ice Open Network
Ice Open Network

Warp
Warp

Juspay
Juspay

Meta de financiamento
20%
Rodrigo Sales




Começando
Temporizador
Animação
Alvos
Propriedades animáveis
tipos de valor entre
Parâmetros Tween
para
de
atraso
duração
facilidade
composição JS
modificador JS
Quadros-chave
Conf

Animação
  
Parâmetros Tween

Desde a versão 4.0.0

para
Anima para um valor especificado a partir do valor alvo atual.
Deve ser definido dentro de um parâmetro de interpolação local Object.

Obrigatório
Somente se não
de
A propriedade está definida

Aceita
Qualquer válido
tipos de valor entre
Um Arrayde dois
Quadros-chave de valor de interpolação
( [fromValue, toValue])
Padrão
O valor alvo atual é usado se apenas um
de
A propriedade está definida

exemplo de código


import { animate } from 'animejs';

animate('.square', {
  x: {
    to: '16rem', // From 0px to 16rem
    ease: 'outCubic',
  },
  rotate: {
    to: '.75turn', // From 0turn to .75turn
    ease: 'inOutQuad'
  },
});

Anterior
Próximo
Parâmetros Tween

de
Anime.js só é possível graças aos nossos incríveis patrocinadores:

Ice Open Network
Ice Open Network

Warp
Warp

Juspay
Juspay

Meta de financiamento
20%
Rodrigo Sales




Começando
Temporizador
Animação
Alvos
Propriedades animáveis
tipos de valor entre
Parâmetros Tween
para
de
atraso
duração
facilidade
composição JS
modificador JS
Quadros-chave
Conf

Animação
  
Parâmetros Tween

Desde a versão 4.0.0

de
V4
Anima de um valor especificado para o valor alvo atual.
Deve ser definido dentro de um parâmetro de interpolação local Object.

Obrigatório
Somente se não
para
A propriedade está definida

Aceita
Qualquer válido
tipos de valor entre
Padrão
O valor alvo atual é usado se apenas um
para
A propriedade está definida

a partir de um exemplo de código


import { animate } from 'animejs';

animate('.square', {
  opacity: { from: .5 }, // Animate from .5 opacity to 1 opacity
  translateX: { from: '16rem' }, // From 16rem to 0rem
  rotate: {
    from: '-.75turn', // From -.75turn to 0turn
    ease: 'inOutQuad',
  },
});

Anterior
Próximo
para

atraso
Anime.js só é possível graças aos nossos incríveis patrocinadores:

Ice Open Network
Ice Open Network

Warp
Warp

Juspay
Juspay

Meta de financiamento
20%
Rodrigo Sales




Começando
Temporizador
Animação
Alvos
Propriedades animáveis
tipos de valor entre
Parâmetros Tween
para
de
atraso
duração
facilidade
composição JS
modificador JS
Quadros-chave
Conf

Animação
  
Parâmetros Tween

Desde a versão 1.0.0

atraso
Define o atraso em milissegundos no início de todas as propriedades animadas, ou localmente para uma propriedade específica.

Aceita
Numberigual ou maior que0
Valor baseado em função
que retorna um Numbervalor igual ou maior que0
Padrão
O valor de atraso da animação (padrão 0).

Para alterar o valor padrão globalmente, atualize o objeto.engine.defaults

import { engine } from 'animejs';
engine.defaults.delay = 500;

exemplo de código de atraso


import { animate } from 'animejs';

const animation = animate('.square', {
  x: '17rem',
  rotate: {
    to: 360,
    delay: 1000, // Local delay applied only to rotate property
  },
  delay: 500,  // Global delay applied to all properties
  loop: true,
  alternate: true
});

Anterior
Próximo
de

duração
Anime.js só é possível graças aos nossos incríveis patrocinadores:

Ice Open Network
Ice Open Network

Warp
Warp

Juspay
Juspay

Meta de financiamento
20%
Rodrigo Sales




Começando
Temporizador
Animação
Alvos
Propriedades animáveis
tipos de valor entre
Parâmetros Tween
para
de
atraso
duração
facilidade
composição JS
modificador JS
Quadros-chave
Conf

Animação
  
Parâmetros Tween

Desde a versão 1.0.0

duração
Define a duração em milissegundos de todas as propriedades animadas ou de uma propriedade específica.

Aceita
Numberigual ou maior que0
Valor baseado em função
que retorna um Numbervalor igual ou maior que0
Valores de duração iguais 1e12ou superiores a Infinitysão limitados internamente a 1e12(aproximadamente 32 anos).

Padrão
O valor da duração da animação (padrão 1000).

Para alterar o valor padrão globalmente, atualize o objeto.engine.defaults

import { engine } from 'animejs';
engine.defaults.duration = 500;

exemplo de código de duração


import { animate } from 'animejs';

const animation = animate('.square', {
  x: '17rem',
  rotate: {
    to: 360,
    duration: 1500, // Local duration only applied to rotate property
  },
  duration: 3000,  // Global duration applied to all properties
  loop: true,
  alternate: true
});

Anterior
Próximo
atraso

facilidade
Anime.js só é possível graças aos nossos incríveis patrocinadores:

Ice Open Network
Ice Open Network

Warp
Warp

Juspay
Juspay

Meta de financiamento
20%
Rodrigo Sales




Começando
Temporizador
Animação
Alvos
Propriedades animáveis
tipos de valor entre
Parâmetros Tween
para
de
atraso
duração
facilidade
composição JS
modificador JS
Quadros-chave
Conf

Animação
  
Parâmetros Tween

Desde a versão 4.0.0

composição
V4
JS
Define como as animações se comportam quando outra animação no mesmo alvo com a mesma propriedade está sendo reproduzida simultaneamente. O modo de composição pode ser definido globalmente para todas as propriedades de animação ou localmente para uma propriedade específica.

Aceita
Modo	Descrição
'replace'	Substitua e cancele a animação em execução.
'none' JS	Não substituir a animação em execução. Isso significa que a animação anterior continuará sendo executada se sua duração for maior que a da nova animação. Esse modo também pode oferecer melhor desempenho.
'blend' JS	Cria uma animação aditiva e combina seus valores com a animação em execução.
0 JS	Abreviação de 'replace'.
1 JS	Abreviação de 'none'.
2 JS	Abreviação de 'blend'.
Padrão
'replace'se a contagem de alvos de animação for inferior a 1000; caso contrário, a composição padrão será definida como 'none'emJSversão se nenhum modo de composição for definido.

Animações aditivas
O 'blend'modo permite criar animações aditivas . Esse tipo de animação permite mesclar suavemente duas animações da mesma propriedade no mesmo alvo. Esse modo funciona melhor em propriedades que se movem visualmente na tela, como 'translate', 'scale', e 'rotation'.

'blend'pegadinhas do modo
A mesclagem só funciona reproduzindo duas ou mais animações com a mesma composição 'blend'simultaneamente.

Atualmente não é possível usar composição 'blend'com:

múltiplos
quadros-chave
cor
valores
o
reverse()
método
o
loop
parâmetro
o
reversed
parâmetro
o
alternate
parâmetro
Animações mescladas devem ser tratadas de forma diferente e só devem ser usadas quando você realmente precisa combinar várias animações.

Para alterar o valor padrão globalmente, atualize o objeto.engine.defaults

import { engine } from 'animejs';
engine.defaults.composition = 'blend';

exemplo de código de composição


import { animate, utils } from 'animejs';

const squares = utils.$('.square');
const [ $none, $replace, $blend ] = squares;

// Animate each square with a different composition mode

squares.forEach($square => {
  // 'none', 'replace', 'blend'
  const mode = $square.classList[1];
  animate($square, {
    scale: [.5, 1],
    alternate: true,
    loop: true,
    duration: 750,
    composition: mode,
  });
});

// Common animation parameters

const enter = { scale: 1.5, duration: 350 };
const leave = { scale: 1.0, duration: 250 };

// Composition none animations

const enterNone = () => animate($none, {
  composition: 'none', ...enter
});

const leaveNone = () => animate($none, {
  composition: 'none', ...leave
});

$none.addEventListener('mouseenter', enterNone);
$none.addEventListener('mouseleave', leaveNone);

// Composition replace animations

const enterReplace = () => animate($replace, {
  composition: 'replace', ...enter
});

const leaveReplace = () => animate($replace, {
  composition: 'replace', ...leave
});

$replace.addEventListener('mouseenter', enterReplace);
$replace.addEventListener('mouseleave', leaveReplace);

// Composition blend animations

const enterBlend = () => animate($blend, {
  composition: 'blend', ...enter
});

const leaveBlend = () => animate($blend, {
  composition: 'blend', ...leave
});

$blend.addEventListener('mouseenter', enterBlend);
$blend.addEventListener('mouseleave', leaveBlend);

Anterior
Próximo
facilidade

modificador
Anime.js só é possível graças aos nossos incríveis patrocinadores:

Ice Open Network
Ice Open Network

Warp
Warp

Juspay
Juspay

Meta de financiamento
20%
Rodrigo Sales




Começando
Temporizador
Animação
Alvos
Propriedades animáveis
tipos de valor entre
Parâmetros Tween
para
de
atraso
duração
facilidade
composição JS
modificador JS
Quadros-chave
Conf

Animação
  
Parâmetros Tween

Desde a versão 4.0.0

modificador
V4
JS
Um Functionmodificador que altera o comportamento do valor numérico animado. Os modificadores podem ser definidos globalmente para todas as propriedades de animação ou localmente para uma propriedade específica. Se o valor animado final contiver strings, como unidades ( '100px'), a parte da string será adicionada automaticamente ao valor final antes de ser aplicada ao elemento.

Maioria
Serviços públicos
As funções podem ser usadas como modificadores.

Aceita
Um modelo Functioncom os seguintes parâmetros:

Parâmetros
Nome	Descrição
value	O valor numérico animado atual
Devoluções obrigatórias
Number

Padrão
null

Para alterar o valor padrão globalmente, atualize o objeto.engine.defaults

import { engine } from 'animejs';
engine.defaults.modifier = v => -v; // Don't do this :D

exemplo de código modificador


import { animate, utils } from 'animejs';

animate('.row:nth-child(1) .square', {
  x: '17rem',
  modifier: utils.round(0), // Round to 0 decimals
  duration: 4000,
});

animate('.row:nth-child(2) .square', {
  x: '85rem',
  modifier: v => v % 17,
  duration: 4000,
});

animate('.row:nth-child(3) .square', {
  x: '17rem',
  y: {
    to: '70rem',
    modifier: v => Math.cos(v) / 2, // Specific modifier to y property
  },
  duration: 4000,
});

Anterior
Próximo
composição

Quadros-chave
Anime.js só é possível graças aos nossos incríveis patrocinadores:

Ice Open Network
Ice Open Network

Warp
Warp

Juspay
Juspay

Meta de financiamento
20%
Rodrigo Sales




Começando
Temporizador
Animação
Alvos
Propriedades animáveis
tipos de valor entre
Parâmetros Tween
Quadros-chave
Valores Tween
Parâmetros Tween JS
Com base na duração JS
Baseado em porcentagem JS
Conf

Animação

Desde a versão 2.0.0

Quadros-chave
Crie uma sequência de animações na mesma propriedade animável.

Quadros-chave de valor da propriedade
Especificamente para uma propriedade animada, esses quadros-chave são passados ​​diretamente para o valor da propriedade:

animate('.square', {
┌───────────────────┐
│ x: [0, 100, 200], ├─ Tween Values Array
│ y: [0, 100, 200], │
└───────────────────┘
  duration: 3000,
}

animate('.square', {
┌────────────────────────────┐
│ x: [{to: 100}, {to: 200}], ├─ Tween Parameters Array
│ y: [{to: 100}, {to: 200}], │
└────────────────────────────┘
  duration: 3000,
}
Quadros-chave de animação
Definidos no nível da animação, esses quadros-chave podem animar várias propriedades por quadro-chave:

animate('.square', {
┌───────────────────────┐
│ keyframes: [          │
│   { x: 100, y: 100 }, ├─ Duration Based
│   { x: 200, y: 200 }, │
│ ],                    │
└───────────────────────┘
  duration: 3000,
}

animate('.square', {
┌───────────────────────────────┐
│ keyframes: {                  │
│   '0%'  : { x: 0,   y: 0   }, │
│   '50%' : { x: 100, y: 100 }, ├─ Percentage Based
│   '100%': { x: 200, y: 200 }, │
│ },                            │
└───────────────────────────────┘
  duration: 3000,
}
Nesta seção
Valores Tween
Parâmetros Tween
Com base na duração
Baseado em porcentagem
Anterior
Próximo
modificador

Quadros-chave de valores de interpolação
Anime.js só é possível graças aos nossos incríveis patrocinadores:

Ice Open Network
Ice Open Network

Warp
Warp

Juspay
Juspay

Meta de financiamento
20%
Rodrigo Sales




Começando
Temporizador
Animação
Alvos
Propriedades animáveis
tipos de valor entre
Parâmetros Tween
Quadros-chave
Valores Tween
Parâmetros Tween JS
Com base na duração JS
Baseado em porcentagem JS
Conf

Animação
  
Quadros-chave

Desde a versão 4.0.0

Quadros-chave de valores de interpolação
V4
Sequências múltiplas
Valor Tween
específico para um
Propriedade animável
usando um Array.
A duração entre cada quadro-chave é igual à duração total da animação dividida pelo número de transições entre cada quadro-chave.
O primeiro quadro-chave define o
a partir do valor
da pré-adolescente.

Você pode usar essa sintaxe para definir rapidamente o valor inicial.
a partir do valor
valor de uma animação:

animate(target: { x: [-100, 100] }); // Animate x from -100 to 100

Aceita
Um Arrayde válido
Valores Tween

Exemplo de código de quadros-chave de valores de interpolação


import { animate } from 'animejs';

animate('.square', {
  translateX: ['0rem', 0, 17, 17, 0, 0],
  translateY: ['0rem', -2.5, -2.5, 2.5, 2.5, 0],
  scale: [1, 1, .5, .5, 1, 1],
  rotate: { to: 360, ease: 'linear' },
  duration: 3000,
  ease: 'inOut', // ease applied between each keyframes if no ease defined
  playbackEase: 'ouIn(5)', // ease applied accross all keyframes
  loop: true,
});

Anterior
Próximo
Quadros-chave

quadros-chave de parâmetros de interpolação
Anime.js só é possível graças aos nossos incríveis patrocinadores:

Ice Open Network
Ice Open Network

Warp
Warp

Juspay
Juspay

Meta de financiamento
20%
Rodrigo Sales




Começando
Temporizador
Animação
Alvos
Propriedades animáveis
tipos de valor entre
Parâmetros Tween
Quadros-chave
Valores Tween
Parâmetros Tween JS
Com base na duração JS
Baseado em porcentagem JS
Conf

Animação
  
Quadros-chave

Desde a versão 2.0.0

quadros-chave de parâmetros de interpolação
JS
Sequências múltiplas
Parâmetros Tween
específico para um
Propriedade animável
.

Essa sintaxe permite um controle muito preciso sobre a animação, dando acesso aos parâmetros ease, delay, duratione para cada quadro-chave individual.modifier

O valor padrão durationde um quadro-chave é igual à duração total da animação dividida pelo número total de quadros-chave.

Aceita
Um Arrayde
Parâmetros Tween

Exemplo de código de quadros-chave de parâmetros de interpolação


import { animate } from 'animejs';

animate('.square', {
  x: [
    { to: '17rem', duration: 700, delay: 400 },
    { to: 0, duration: 700, delay: 800 },
  ],
  y: [
    { to: '-2.5rem', ease: 'out', duration: 400 },
    { to: '2.5rem', duration: 800, delay: 700 },
    { to: 0, ease: 'in', duration: 400, delay: 700 },
  ],
  scale: [
    { to: .5, duration: 700, delay: 400 },
    { to: 1, duration: 700, delay: 800 },
  ],
  rotate: { to: 360, ease: 'linear' },
  duration: 3000,
  ease: 'inOut', // ease applied between each keyframes if no ease defined
  playbackEase: 'ouIn(5)', // ease applied accross all keyframes
  loop: true,
});

Anterior
Próximo
Quadros-chave de valores de interpolação

Quadros-chave baseados na duração
Anime.js só é possível graças aos nossos incríveis patrocinadores:

Ice Open Network
Ice Open Network

Warp
Warp

Juspay
Juspay

Meta de financiamento
20%
Rodrigo Sales




Começando
Temporizador
Animação
Alvos
Propriedades animáveis
tipos de valor entre
Parâmetros Tween
Quadros-chave
Valores Tween
Parâmetros Tween JS
Com base na duração JS
Baseado em porcentagem JS
Conf

Animação
  
Quadros-chave

Desde a versão 2.0.0

Quadros-chave baseados na duração
JS
Sequências múltiplas
Propriedade animável
um após o outro.

Essa sintaxe permite um controle muito preciso sobre a animação, dando acesso aos parâmetros ease, delay, duratione para cada quadro-chave individual.modifier

A duração padrão de um quadro-chave é igual à duração total da animação dividida pelo número total de quadros-chave.

keyframes: [
  { y: 50, ease: 'out', duration: 400 },
  { x: 75, scale: .5, duration: 800 },
]

Aceita
Um Arraycontendo Objectum
Propriedade animável
e
Parâmetros Tween

Exemplo de código para quadros-chave baseados em duração


import { animate } from 'animejs';

animate('.square', {
  keyframes: [
    { y: '-2.5rem', ease: 'out', duration: 400 },
    { x: '17rem', scale: .5, duration: 800 },
    { y: '2.5rem' }, // The duration here is 3000 / 5 = 600ms
    { x: 0, scale: 1, duration: 800 },
    { y: 0, ease: 'in', duration: 400 }
  ],
  rotate: { to: 360, ease: 'linear' },
  duration: 3000,
  ease: 'inOut', // ease applied between each keyframes if no ease defined
  playbackEase: 'ouIn(5)', // ease applied accross all keyframes
  loop: true,
});

Anterior
Próximo
quadros-chave de parâmetros de interpolação

Quadros-chave baseados em porcentagem
Anime.js só é possível graças aos nossos incríveis patrocinadores:

Ice Open Network
Ice Open Network

Warp
Warp

Juspay
Juspay

Meta de financiamento
20%
Rodrigo Sales




Começando
Temporizador
Animação
Alvos
Propriedades animáveis
tipos de valor entre
Parâmetros Tween
Quadros-chave
Valores Tween
Parâmetros Tween JS
Com base na duração JS
Baseado em porcentagem JS
Conf

Animação
  
Quadros-chave

Desde a versão 4.0.0

Quadros-chave baseados em porcentagem
V4
JS
Sequências múltiplas
Propriedades animáveis
com posições definidas a partir de uma porcentagem da duração total da animação.

Essa sintaxe é muito semelhante à @keyframessintaxe CSS e expõe apenas o controle sobre o
ease
parâmetro para cada quadro-chave individual.

O primeiro quadro-chave define o
a partir do valor
da pré-adolescente.

keyframes: {
  '25%' : { x: 100, y: 50, ease: 'out' },
  '50%' : { x: 200, y: 75, },
}

Aceita
Um Objectlugar

keysestão Stringrepresentando as porcentagens
valuessão Objectcontendo pelo menos um
Propriedades animáveis
e uma opção
ease
parâmetro.
Exemplo de código de quadros-chave baseados em porcentagem


import { animate } from 'animejs';

animate('.square', {
  keyframes: {
    '0%'  : { x: '0rem', y: '0rem', ease: 'out' },
    '13%' : { x: '0rem', y: '-2.5rem', },
    '37%' : { x: '17rem', y: '-2.5rem', scale: .5 },
    '63%' : { x: '17rem', y: '2.5rem', scale: .5 },
    '87%' : { x: '0rem', y: '2.5rem', scale: 1 },
    '100%': { y: '0rem', ease: 'in' }
  },
  rotate: { to: 360, ease: 'linear' },
  duration: 3000,
  ease: 'inOut', // ease applied between each keyframes if no ease defined
  playbackEase: 'ouIn(5)', // ease applied accross all keyframes
  loop: true,
});

Anterior
Próximo
Quadros-chave baseados na duração

Configurações de reprodução de animação
Anime.js só é possível graças aos nossos incríveis patrocinadores:

Ice Open Network
Ice Open Network

Warp
Warp

Juspay
Juspay

Meta de financiamento
20%
Rodrigo Sales




gurações de reprodução
atraso
duração
laço
loopDelay JS
alternar
invertido
reprodução automática
taxa de quadros JS
Taxa de reprodução
Facilidade de reprodução JS
persistir WAAPI
Retornos de chamada
Métodos
Propriedades
Linha do tempo
Animável
Arrastável
Escopo
Eventos

Animação

Desde a versão 1.0.0

Configurações de reprodução de animação
Especifique os tempos e comportamentos de uma animação.
As propriedades de configuração de reprodução são definidas diretamente nos animate()parâmetros Object.

animate('.square', {
  translateX: 100,
  scale: 2,
  opacity: .5,
  duration: 400,
  delay: 250,
  ease: 'out(3)',
┌───────────────────┐
│ loop: 3,          │
│ alternate: true,  ├─ Playback Settings
│ autoplay: false,  │
└───────────────────┘
  onBegin: () => {},
  onLoop: () => {},
  onUpdate: () => {},
});
Nesta seção
atraso
duração
laço
loopDelay
alternar
invertido
reprodução automática
taxa de quadros
Taxa de reprodução
Facilidade de reprodução
persistir
Anterior
Próximo
Quadros-chave baseados em porcentagem

atraso
Anime.js só é possível graças aos nossos incríveis patrocinadores:

Ice Open Network
Ice Open Network

Warp
Warp

Juspay
Juspay

Meta de financiamento
20%
Rodrigo Sales




gurações de reprodução
atraso
duração
laço
loopDelay JS
alternar
invertido
reprodução automática
taxa de quadros JS
Taxa de reprodução
Facilidade de reprodução JS
persistir WAAPI
Retornos de chamada
Métodos
Propriedades
Linha do tempo
Animável
Arrastável
Escopo
Eventos

Animação
  
Configurações de reprodução

Desde a versão 4.0.0

invertido
V4
Define a direção inicial da animação.

Aceita
Boolean

Se configurado para truereproduzir a animação ao contrário.
Se configurado para falsereproduzir a animação para a frente.
Padrão
false

Para alterar o valor padrão globalmente, atualize o objeto.engine.defaults

import { engine } from 'animejs';
engine.defaults.reversed = true;

exemplo de código reverso


import { animate } from 'animejs';

animate('.dir-normal', {
  x: '17rem',
  reversed: false, // Default behaviour
  loop: true
});

animate('.dir-reverse', {
  x: '17rem',
  reversed: true,
  loop: true
});

Anterior
Próximo
alternar

reprodução automática
Anime.js só é possível graças aos nossos incríveis patrocinadores:

Ice Open Network
Ice Open Network

Warp
Warp

Juspay
Juspay

Meta de financiamento
20%
Rodrigo Sales




gurações de reprodução
atraso
duração
laço
loopDelay JS
alternar
invertido
reprodução automática
taxa de quadros JS
Taxa de reprodução
Facilidade de reprodução JS
persistir WAAPI
Retornos de chamada
Métodos
Propriedades
Linha do tempo
Animável
Arrastável
Escopo
Eventos

Animação
  
Configurações de reprodução

Desde a versão 4.0.0

taxa de quadros
V4
JS
Determina o número de quadros por segundo (fps) em que uma animação é reproduzida.
Este valor pode ser modificado posteriormente com .animation.fps = 30

Aceita
Um Numbermaior que0

A taxa de quadros é limitada à taxa de atualização do monitor ou, em alguns casos, pelo próprio navegador.

Padrão
120

Para alterar o valor padrão globalmente, atualize o objeto.engine.defaults

import { engine } from 'animejs';
engine.defaults.frameRate = 30;

Exemplo de código frameRate


import { animate } from 'animejs';

const [ $range ] = utils.$('.range');
const [ $fps ] = utils.$('.fps');

const animation = animate('.circle', {
  x: '16rem',
  loop: true,
  alternate: true,
  frameRate: 60,
});

const updateFps = () => {
  const { value } = $range;
  $fps.innerHTML = value;
  animation.fps = value;
}

$range.addEventListener('input', updateFps);

Anterior
Próximo
reprodução automática

Taxa de reprodução
Anime.js só é possível graças aos nossos incríveis patrocinadores:

Ice Open Network
Ice Open Network

Warp
Warp

Juspay
Juspay

Meta de financiamento
20%
Rodrigo Sales




gurações de reprodução
atraso
duração
laço
loopDelay JS
alternar
invertido
reprodução automática
taxa de quadros JS
Taxa de reprodução
Facilidade de reprodução JS
persistir WAAPI
Retornos de chamada
Métodos
Propriedades
Linha do tempo
Animável
Arrastável
Escopo
Eventos

Animação
  
Configurações de reprodução

Desde a versão 4.0.0

Taxa de reprodução
V4
Define um multiplicador de velocidade para acelerar ou desacelerar uma animação.
Este valor pode ser modificado posteriormente com .animation.speed = .5

Aceita
Maior Numberou igual a0

Se configurado para isso, 0a animação não será reproduzida.

Padrão
1

Para alterar o valor padrão globalmente, atualize o objeto.engine.defaults

import { engine } from 'animejs';
engine.defaults.playbackRate = .75;

Exemplo de código playbackRate


import { animate, utils } from 'animejs';

const [ $range ] = utils.$('.range');
const [ $speed ] = utils.$('.speed');

const animation = animate('.circle', {
  x: '16rem',
  loop: true,
  alternate: true,
  playbackRate: 1,
});

const updateSpeed = () => {
  const { value } = $range;
  $speed.innerHTML = utils.roundPad(+value, 2);
  utils.sync(() => animation.speed = value);
}

$range.addEventListener('input', updateSpeed);

Anterior
Próximo
taxa de quadros

Facilidade de reprodução
Anime.js só é possível graças aos nossos incríveis patrocinadores:

Ice Open Network
Ice Open Network

Warp
Warp

Juspay
Juspay

Meta de financiamento
20%
Rodrigo Sales




Começando
Temporizador
Animação
Linha do tempo
Animável
Arrastável
Parâmetros dos eixos
Configurações
Retornos de chamada
Métodos
Propriedades
Escopo
Eventos

Arrastável
V4
Adiciona funcionalidades de arrastar e soltar aos elementos DOM.
Os elementos arrastáveis ​​são criados usando o createDraggable()método importado do 'animejs'módulo principal:

import { createDraggable } from 'animejs';

const draggable = createDraggable(target, parameters);

Ou importado como um módulo independente do'animejs/draggable' 
subcaminho
:

import { createDraggable } from 'animejs/draggable';

Parâmetros
Nome	Aceita
alvo	
Seletor CSS
|
Elemento DOM
parâmetros (opcional)	Um Objectde
Parâmetros dos eixos arrastáveis
,
Configurações arrastáveis
e
Callbacks arrastáveis
Devoluções
Draggable

Exemplo de código arrastável


import { createDraggable } from 'animejs';

createDraggable('.square');

Nesta seção
Parâmetros dos eixos
Configurações
Retornos de chamada
Métodos
Propriedades
Anterior
Próximo
Propriedades animáveis

Parâmetros dos eixos arrastáveis
Anime.js só é possível graças aos nossos incríveis patrocinadores:

Ice Open Network
Ice Open Network

Warp
Warp

Juspay
Juspay

Meta de financiamento
20%
Rodrigo Sales




Começando
Temporizador
Animação
Linha do tempo
Animável
Configurações
Métodos
Propriedades
Arrastável
Escopo
Eventos

Animável

Desde a versão 4.0.0

Propriedades animáveis
Propriedades disponíveis na Animatableinstância retornada por uma createAnimatable()função.

const animatable = createAnimatable(targets, parameters);
           ┌───────────┐
animatable.│targets    ├─ Properties
animatable.│animations │
           └───────────┘
Nome	Descrição
metas	Obtém o elemento animável.
Alvos
( Array)
animações	Torna-se totalmente animável
Animações
( Object)
Anterior
Próximo
reverter()

Arrastável
Anime.js só é possível graças aos nossos incríveis patrocinadores:

Rede Aberta de Gelo
Rede Aberta de Gelo

Urdidura
Urdidura

Juspay
Juspay

Meta de financiamento
20%
Rodrigo Vendasempreendedor4lyf
Jules
LambdaTest
Justin Hall
Dan Milward
Aaron Kenton
Exercício físico
Aaron Iker
Andoni Enriquez



Começando
Temporizador
Animação
Linha do tempo
Animável
Configurações
Métodos
Getters
Levantadores
reverter()
Propriedades
Arrastável
Escopo
Eventos

Animável
  
Métodos

Desde a versão 4.0.0

reverter()
Restaura todos os valores originais das propriedades animáveis ​​e limpa os estilos CSS embutidos.

Use esta opção revert()quando quiser interromper e destruir completamente um elemento animável.

Devoluções
O próprio animável

Pode ser encadeado com outros métodos animáveis.

Exemplo de código revert()


import { createAnimatable, utils, stagger } from 'animejs';

const $demos = document.querySelector('#docs-demos');
const $demo = $demos.querySelector('.docs-demo.is-active');
const [ $revertButton ] = utils.$('.revert');
let bounds = $demo.getBoundingClientRect();
const refreshBounds = () => bounds = $demo.getBoundingClientRect();

const circles = createAnimatable('.circle', {
  x: stagger(50, { from: 'center', start: 100 }),
  y: stagger(200, { from: 'center', start: 200 }),
  ease: 'out(4)',
});

const onMouseMove = e => {
  const { width, height, left, top } = bounds;
  const hw = width / 2;
  const hh = height / 2;
  const x = utils.clamp(e.clientX - left - hw, -hw, hw);
  const y = utils.clamp(e.clientY - top - hh, -hh, hh);
  circles.x(x).y(y);
}

const revertAnimatable = () => {
  window.removeEventListener('mousemove', onMouseMove);
  circles.revert();
}

$revertButton.addEventListener('click', revertAnimatable);
window.addEventListener('mousemove', onMouseMove);
$demos.addEventListener('scroll', refreshBounds);

Anterior
Próximo
Levantadores

Propriedades animáveis
Anime.js só é possível graças aos nossos incríveis patrocinadores:

Ice Open Network
Ice Open Network

Warp
Warp

Juspay
Juspay

Meta de financiamento
20%
Rodrigo Sales




Começando
Temporizador
Animação
Linha do tempo
Animável
Configurações
Métodos
Getters
Levantadores
reverter()
Propriedades
Arrastável
Escopo
Eventos

Animável
  
Métodos

Desde a versão 4.0.0

Levantadores
Todas as propriedades animáveis ​​definidas nos parâmetros animáveis ​​são transformadas em métodos e acessíveis no objeto animável.

Ao chamar um método com pelo menos um argumento, o método atua como um setter e retorna a instância animável, permitindo o encadeamento de chamadas de métodos.

animatable.property(value, duration, easing);

Parâmetros
Nome	Tipo	Descrição
valor	Number|
Array<Number>	Define o novo valor do elemento animável para o qual a animação será aplicada.
duração (opcional)	Number	Nova duração de transição opcional em ms
flexibilização (opcional)	
facilidade
Nova função opcional de suavização da animação
Devoluções
O próprio objeto animável, permitindo o encadeamento de múltiplas chamadas de definição de propriedades:

animatable.x(100).y(200); // Animate x to 100 and y to 200 in 500ms

Exemplo de código Setters


import { createAnimatable, utils } from 'animejs';

const $demos = document.querySelector('#docs-demos');
const $demo = document.querySelector('.docs-demo.is-active');
let bounds = $demo.getBoundingClientRect();
const refreshBounds = () => bounds = $demo.getBoundingClientRect();

const circle = createAnimatable('.circle', {
  x: 0,
  y: 0,
  backgroundColor: 0,
  ease: 'outExpo',
});

const rgb = [164, 255, 79];

// Sets new durations and easings
circle.x(0, 500, 'out(2)');
circle.y(0, 500, 'out(3)');
circle.backgroundColor(rgb, 250);

const onMouseMove = e => {
  const { width, height, left, top } = bounds;
  const hw = width / 2;
  const hh = height / 2;
  const x = utils.clamp(e.clientX - left - hw, -hw, hw);
  const y = utils.clamp(e.clientY - top - hh, -hh, hh);
  rgb[0] = utils.mapRange(x, -hw, hw, 0, 164);
  rgb[2] = utils.mapRange(x, -hw, hw, 79, 255);
  circle.x(x).y(y).backgroundColor(rgb); // Update values
}

window.addEventListener('mousemove', onMouseMove);
$demos.addEventListener('scroll', refreshBounds);

Anterior
Próximo
Getters

reverter()
Anime.js só é possível graças aos nossos incríveis patrocinadores:

Ice Open Network
Ice Open Network

Warp
Warp

Juspay
Juspay

Meta de financiamento
20%
Rodrigo Sales




Começando
Temporizador
Animação
Linha do tempo
Animável
Configurações
Métodos
Getters
Levantadores
reverter()
Propriedades
Arrastável
Escopo
Eventos

Animável
  
Métodos

Desde a versão 4.0.0

Getters
Todas as propriedades animáveis ​​definidas nos parâmetros animáveis ​​são transformadas em métodos e acessíveis no objeto animável.

Ao chamar um método sem nenhum argumento, o método age como um getter e retorna o valor atual da propriedade animável.

Devoluções
A Numberse a propriedade animável atual tiver um único valor.
Um Arrayerro que ocorre Numberse a propriedade animável atual tiver vários valores (como um valor de cor RGB).
Exemplo de código Getters


import { createAnimatable, utils } from 'animejs';

const $demos = document.querySelector('#docs-demos');
const $demo = document.querySelector('.docs-demo.is-active');
const [ $x, $y ] = utils.$('.coords');
let bounds = $demo.getBoundingClientRect();
const refreshBounds = () => bounds = $demo.getBoundingClientRect();

const circle = createAnimatable('.circle', {
  x: 500,
  y: 500,
  ease: 'out(2)',
});

// Gets and log the current x and y values
circle.animations.x.onRender = () => {
  $x.innerHTML = utils.roundPad(circle.x(), 2);
  $y.innerHTML = utils.roundPad(circle.y(), 2);
}

const onMouseMove = e => {
  const { width, height, left, top } = bounds;
  const hw = width / 2;
  const hh = height / 2;
  const x = utils.clamp(e.clientX - left - hw, -hw, hw);
  const y = utils.clamp(e.clientY - top - hh, -hh, hh);
  // Sets x and y values
  circle.x(x);
  circle.y(y);
}

window.addEventListener('mousemove', onMouseMove);
$demos.addEventListener('scroll', refreshBounds);

Anterior
Próximo
Métodos animáveis

Levantadores
Anime.js só é possível graças aos nossos incríveis patrocinadores:

Ice Open Network
Ice Open Network

Warp
Warp

Juspay
Juspay

Meta de financiamento
20%
Rodrigo Sales




Começando
Temporizador
Animação
Linha do tempo
Animável
Arrastável
Parâmetros dos eixos
x
y
foto
modificador
mapTo
Configurações
Retornos de chamada
Métodos
Propriedades
Escopo
Eventos

Arrastável
  
Parâmetros dos eixos

Desde a versão 4.0.0

x
Define o comportamento do eixo x, passando um objeto de parâmetros ou desativando-o ao definir o valor como false.

Aceita
Boolean
Parâmetros dos eixos arrastáveis
 Object
Padrão
true

exemplo de código x


import { createDraggable } from 'animejs';

createDraggable('.square.enabled', {
  x: true
});

createDraggable('.square.disabled', {
  x: false
});

Anterior
Próximo
Parâmetros dos eixos arrastáveis

y
Anime.js só é possível graças aos nossos incríveis patrocinadores:

Rede Aberta de Gelo
Rede Aberta de Gelo

Urdidura
Urdidura

Juspay
Juspay

Meta de financiamento
20%
Rodrigo Vendasempreendedor4lyf
Jules
LambdaTest
Justin Hall
Dan Milward
Aaron Kenton
Exercício físico
Aaron Iker
Andoni Enriquez



Começando
Temporizador
Animação
Linha do tempo
Animável
Arrastável
Parâmetros dos eixos
x
y
foto
modificador
mapTo
Configurações
Retornos de chamada
Métodos
Propriedades
Escopo
Eventos

Arrastável
  
Parâmetros dos eixos

Desde a versão 4.0.0

y
Define o comportamento do eixo y, passando um objeto de parâmetros ou desativando-o ao definir o valor como false.

Aceita
Boolean
Parâmetros dos eixos arrastáveis
 Object
Padrão
true

exemplo de código y


import { createDraggable } from 'animejs';

createDraggable('.square.enabled', {
  y: true
});

createDraggable('.square.disabled', {
  y: false
});

Anterior
Próximo
x

foto
Anime.js só é possível graças aos nossos incríveis patrocinadores:

Rede Aberta de Gelo
Rede Aberta de Gelo

Urdidura
Urdidura

Juspay
Juspay

Meta de financiamento
20%
Rodrigo Vendasempreendedor4lyf
Jules
LambdaTest
Justin Hall
Dan Milward
Aaron Kenton
Exercício físico
Aaron Iker
Andoni Enriquez



Começando
Temporizador
Animação
Linha do tempo
Animável
Arrastável
Parâmetros dos eixos
x
y
foto
modificador
mapTo
Configurações
Retornos de chamada
Métodos
Propriedades
Escopo
Eventos

Arrastável
  
Parâmetros dos eixos

Desde a versão 4.0.0

foto
Arredonda o valor final de ambos os eixos ou de um eixo específico para o incremento especificado mais próximo.
Se um valor Arrayfor fornecido como incremento, ele seleciona o valor mais próximo da matriz.

Aceita
Number
Array<Number>
Uma Functionopção que retorna qualquer valor se o acima
Quando definido usando um `<div>` Function, o valor será atualizado automaticamente sempre que o contêiner ou o elemento de destino for redimensionado.
Ele também pode ser atualizado manualmente usando o `<div>`.
refresh()
método.

Padrão
0

exemplo de código snap


CSS

import { createDraggable } from 'animejs';

createDraggable('.square', {
  container: '.grid',
  snap: 56, // Global to both x and y
  x: { snap: [0, 200] }, // Specific to x 
});

Anterior
Próximo
y

modificador
Anime.js só é possível graças aos nossos incríveis patrocinadores:

Ice Open Network
Ice Open Network

Warp
Warp

Juspay
Juspay

Meta de financiamento
20%
Rodrigo Sales




Começando
Temporizador
Animação
Linha do tempo
Animável
Arrastável
Parâmetros dos eixos
x
y
foto
modificador
mapTo
Configurações
Retornos de chamada
Métodos
Propriedades
Escopo
Eventos

Arrastável
  
Parâmetros dos eixos

Desde a versão 4.0.0

modificador
Define um
Função modificadora
que alteram ou modificam o valor de ambos os eixos ou de um eixo específico.

Aceita
Função modificadora

Padrão
noop

exemplo de código modificador


import { createDraggable, utils } from 'animejs';

createDraggable('.square', {
  modifier: utils.wrap(-32, 32), // Global to both x and y
  x: { modifier: utils.wrap(-128, 128) }, // Specific to x 
});

Anterior
Próximo
foto

mapTo
Anime.js só é possível graças aos nossos incríveis patrocinadores:

Rede Aberta de Gelo
Rede Aberta de Gelo

Urdidura
Urdidura

Juspay
Juspay

Meta de financiamento
20%
Rodrigo Vendasempreendedor4lyf
Jules
LambdaTest
Justin Hall
Dan Milward
Aaron Kenton
Exercício físico
Aaron Iker
Andoni Enriquez



Começando
Temporizador
Animação
Linha do tempo
Animável
Arrastável
Parâmetros dos eixos
x
y
foto
modificador
mapTo
Configurações
Retornos de chamada
Métodos
Propriedades
Escopo
Eventos

Arrastável
  
Parâmetros dos eixos

Desde a versão 4.0.0

mapTo
Mapeia o valor do eixo para uma propriedade diferente do elemento.

Aceita
String

Padrão
null

Exemplo de código mapTo


import { createDraggable, utils } from 'animejs';

utils.set('.square', { z: 100 });

createDraggable('.square', {
  x: { mapTo: 'rotateY' },
  y: { mapTo: 'z' },
});

Anterior
Próximo
modificador

Configurações arrastáveis
Anime.js só é possível graças aos nossos incríveis patrocinadores:

Rede Aberta de Gelo
Rede Aberta de Gelo

Urdidura
Urdidura

Juspay
Juspay

Meta de financiamento
20%
Rodrigo Vendasempreendedor4lyf
Jules
LambdaTest
Justin Hall
Dan Milward
Aaron Kenton
Exercício físico
Aaron Iker
Andoni Enriquez




  
Configurações

Desde a versão 4.0.0

acionar
Especifica um elemento diferente do alvo definido para acionar a animação de arrastar.

Aceita
Seletor CSS
Elemento DOM
exemplo de código de gatilho


import { createDraggable } from 'animejs';

createDraggable('.row', {
  trigger: '.circle',
});

Anterior
Próximo
Configurações arrastáveis

recipiente
Anime.js só é possível graças aos nossos incríveis patrocinadores:

Rede Aberta de Gelo
Rede Aberta de Gelo

Urdidura
Urdidura

Juspay
Juspay

Meta de financiamento
20%
Rodrigo Vendasempreendedor4lyf
Jules
LambdaTest
Justin Hall
Dan Milward
Aaron Kenton
Exercício físico
Aaron Iker
Andoni Enriquez




  
Configurações

Desde a versão 4.0.0

recipiente
Especifica o contêiner do elemento arrastável, impedindo que ele seja arrastado para fora dos limites definidos.

Aceita
Seletor CSS
 Stringpara atingir umHTMLElement
HTMLElement
Array<Number>( [top, right, bottom, left])
Um Functionque retorna ( )Array<Number>[top, right, bottom, left]
Quando definido usando um `<a>` Function, o valor será atualizado automaticamente sempre que a janela ou o elemento alvo for redimensionado.
Ele também pode ser atualizado manualmente usando o `<a>`.
refresh()
método.

Padrão
null

exemplo de código de contêiner


CSS

import { createDraggable } from 'animejs';

createDraggable('.square', {
  container: '.grid',
});

createDraggable('.circle', {
  container: [-16, 80, 16, 0],
});

Anterior
Próximo
acionar

containerPadding
Anime.js só é possível graças aos nossos incríveis patrocinadores:

Ice Open Network
Ice Open Network

Warp
Warp

Juspay
Juspay

Meta de financiamento
20%
Rodrigo Sales





  
Configurações

Desde a versão 4.0.0

atrito do contêiner
Especifica o atrito aplicado ao elemento arrastado ao sair dos limites, onde 0significa nenhum atrito e 1impede que o elemento ultrapasse os limites do contêiner.

Aceita
Maior Numberou igual a 0e menor ou igual a1
Um Functionvalor que retorna Numbermaior ou igual a 0e menor ou igual a1
Quando definido usando um `<div>` Function, o valor será atualizado automaticamente sempre que o contêiner ou o elemento de destino for redimensionado.
Ele também pode ser atualizado manualmente usando o `<div>`.
refresh()
método.

Padrão
0.8

Exemplo de código containerFriction


import { createDraggable } from 'animejs';

createDraggable('.square', {
  container: '.grid',
  containerFriction: 0,
});

createDraggable('.circle', {
  container: '.grid',
  containerFriction: 1,
});

Anterior
Próximo
containerPadding

liberarAtritoDoContêiner
Anime.js só é possível graças aos nossos incríveis patrocinadores:

Ice Open Network
Ice Open Network

Warp
Warp

Juspay
Juspay

Meta de financiamento
20%
Rodrigo Sales




Começando
Temporizador
Animação
Linha do tempo
Animável
Arrastável
Escopo
Eventos
SVG
Texto
splitText()
Configurações
Parâmetros de divisão
Modelo HTML
Métodos
Propriedades
Serviços públicos
Flexibilizações
WAAPI
Motor
Texto

Desde a versão 4.1.0

splitText()
Uma função utilitária de texto leve, responsiva e acessível para dividir, clonar e quebrar linhas, palavras e caracteres de um elemento HTML.
As divisões de texto são criadas usando a splitText()função.

import { splitText } from 'animejs';

const split = splitText(target, parameters);

Desde
v4.2.0
O splitText()método também pode ser importado independentemente, sem a necessidade de importar toda a biblioteca.

import { splitText } from 'animejs/text';

Parâmetros
Nome	Aceita
alvo	Um seletor CSS válido String|HTMLElement
parâmetros (opcional)	Um Objectde
Configurações do TextSplitter
Devoluções
TextSplitter

Exemplo de código splitText()


CSS

import { createTimeline, stagger, utils, splitText } from 'animejs';

const { words, chars } = splitText('p', {
  words: { wrap: 'clip' },
  chars: true,
});

createTimeline({
  loop: true,
  defaults: { ease: 'inOut(3)', duration: 650 }
})
.add(words, {
  y: [$el => +$el.dataset.line % 2 ? '100%' : '-100%', '0%'],
}, stagger(125))
.add(chars, {
  y: $el => +$el.dataset.line % 2 ? '100%' : '-100%',
}, stagger(10, { from: 'random' }))
.init();


Configurações do TextSplitter
Anime.js só é possível graças aos nossos incríveis patrocinadores:

Ice Open Network
Ice Open Network

Warp
Warp

Juspay
Juspay

Meta de financiamento
20%
Rodrigo Sales




Começando
Temporizador
Animação
Linha do tempo
Animável
Arrastável
Escopo
Eventos
SVG
Texto
splitText()
Configurações
linhas
palavras
personagens
depurar
incluirEspaços
acessível
Parâmetros de divisão
Modelo HTML
Métodos
Propriedades
Serviços públicos
Flexibilizações
WAAPI
Motor
Texto
  
splitText()

Desde a versão 4.1.0

Configurações do TextSplitter
Configura como o texto dentro do elemento HTML de destino deve ser dividido.

splitText(target, {
┌────────────────────────┐
│ lines: true,           ├─ Settings
│ words: {               │
│   wrap: 'clip',        │
│   class: 'split-word', │
│   clone: true          │
│ },                     │
│ includeSpaces: true,   │
│ debug: true,           │
└────────────────────────┘
});
Nesta seção
linhas
palavras
personagens
depurar
incluirEspaços
acessível
Anterior
Próximo
splitText()

linhas
Anime.js só é possível graças aos nossos incríveis patrocinadores:

Ice Open Network
Ice Open Network

Warp
Warp

Juspay
Juspay

Meta de financiamento
20%
Rodrigo Sales




Começando
Temporizador
Animação
Linha do tempo
Animável
Arrastável
Escopo
Eventos
SVG
Texto
splitText()
Configurações
linhas
palavras
personagens
depurar
incluirEspaços
acessível
Parâmetros de divisão
Modelo HTML
Métodos
Propriedades
Serviços públicos
Flexibilizações
WAAPI
Motor
Texto
  
splitText()
  
Configurações

Desde a versão 4.1.0

linhas
Define se e como as linhas devem ser divididas.
Os elementos da linha dividida são acessados ​​por meio de uma matriz retornada pela linespropriedade de uma TextSplitinstância.

const { lines } = splitText(target, { lines: true });

Wrappers divididos padrão
Por padrão, cada linha é envolvida por um elemento span com os seguintes estilos e atributos de dados:

<span style="display: block;" data-line="0">This is the first line</span>
<span style="display: block;" data-line="1">This is the second line</span>
<span style="display: block;" data-line="2">This is the third line</span>

Envoltórios divididos personalizados
Os wrappers divididos podem ser configurados passando um Objectde
Parâmetros de divisão
ou passando um personalizado
Modelo HTML
 String.

Dividir elementos aninhados
Elementos aninhados são duplicados entre linhas quando necessário. Por exemplo, o seguinte HTML:

<p>
  This is a text <a href="#link">with a link 
  that contains a nested <em>em 
  element</em></a>
</p>

O resultado após a divisão é a seguinte estrutura (estilos CSS omitidos para maior clareza):

<p>
  <span>This is a text <a href="#link">with a link</a></span>
  <span><a href="#link">that contains a nested <em>em</em></a></span>
  <span><a href="#link"><em>element</em></a></span>
</p>

Carregamento de fontes e redimensionamento de linhas
Para evitar cálculos incorretos de linhas, as linhas são divididas após a conclusão de todo o carregamento de fontes e operações de layout, aguardando a conclusão do
document.fonts.ready.then
promessa a cumprir.
Então, se o elemento alvo for redimensionado, as linhas são automaticamente divididas novamente, sobrescrevendo os elementos de linhas, palavras e caracteres existentes no processo.

Animação de linhas, palavras e caracteres ao dividir em linhas.
Cada divisão de linha sobrescreve os elementos divididos existentes, o que faz com que as animações dos elementos divididos em execução parem assim que as fontes forem carregadas ou sempre que o elemento de texto for redimensionado.
Declarar uma animação dentro do
split.addEffect()
O método garante a reprodução contínua entre redimensionamentos e reverte automaticamente ao usar o dispositivo.
split.revert()
.

const split = splitText(target, params);

split.addEffect(({ lines, words, chars }) => animate([lines, words, chars], {
  opacity: { from: 0 },
}));

split.revert(); // This also reverts the animation declared with addEffect

Aceita
Boolean
Objectde
Parâmetros de divisão
Modelo HTML
 String
Padrão
false

exemplo de código de linhas


import { animate, splitText, stagger } from 'animejs';

splitText('p', {
  lines: { wrap: 'clip' },
})
.addEffect(({ lines }) => animate(lines, {
  y: [
    { to: ['100%', '0%'] },
    { to: '-100%', delay: 750, ease: 'in(3)' }
  ],
  duration: 750,
  ease: 'out(3)',
  delay: stagger(200),
  loop: true,
  loopDelay: 500,
}));

Anterior
Próximo
Configurações do TextSplitter

palavras
Anime.js só é possível graças aos nossos incríveis patrocinadores:

Ice Open Network
Ice Open Network

Warp
Warp

Juspay
Juspay

Meta de financiamento
20%
Rodrigo Sales




Começando
Temporizador
Animação
Linha do tempo
Animável
Arrastável
Escopo
Eventos
SVG
Texto
splitText()
Configurações
linhas
palavras
personagens
depurar
incluirEspaços
acessível
Parâmetros de divisão
Modelo HTML
Métodos
Propriedades
Serviços públicos
Flexibilizações
WAAPI
Motor
Texto
  
splitText()
  
Configurações

Desde a versão 4.1.0

palavras
Define se e como as palavras devem ser divididas.
Os elementos das palavras divididas são acessados ​​por meio de um array retornado pela wordspropriedade de uma TextSplitinstância.

const { words } = splitText(target, { words: true });

Internamente, para navegadores que oferecem suporte, a divisão de palavras é feita usando o recurso nativo.
Intl.Segmenter
objeto, permitindo a divisão de palavras para idiomas que não usam espaços, como japonês, chinês, tailandês, laosiano, khmer, birmanês, etc., e recorre ao uso de espaços como alternativa.
String.prototype.split()
Para navegadores mais antigos.

Wrappers divididos padrão
Por padrão, cada palavra é envolvida em um elemento span com os seguintes estilos e atributos de dados:

<span style="display: inline-block;" data-line="0" data-word="0">Split</span>
<span style="display: inline-block;" data-line="0" data-word="1">by</span>
<span style="display: inline-block;" data-line="0" data-word="2">words</span>

Envoltórios divididos personalizados
Os wrappers divididos podem ser configurados passando um Objectde
Parâmetros de divisão
ou passando um personalizado
Modelo HTML
 String.

Animação de palavras mesmo quando divididas por linhas.
Cada divisão de linha sobrescreve os elementos de palavra existentes, o que faz com que as animações de palavras em execução parem assim que as fontes forem carregadas ou sempre que o elemento de texto for redimensionado.
Declarar uma animação dentro do
split.addEffect()
O método garante a reprodução contínua entre redimensionamentos e reverte automaticamente ao usar o dispositivo.
split.revert()
.

const split = splitText(target, params);

split.addEffect(({ lines, words, chars }) => animate([lines, words, chars], {
  opacity: { from: 0 },
}));

split.revert(); // This also reverts the animation declared with addEffect

Aceita
Boolean
Objectde
Parâmetros de divisão
Modelo HTML
 String
Padrão
true

exemplo de código de palavras


import { animate, splitText, stagger } from 'animejs';

const { words } = splitText('p', {
  words: { wrap: 'clip' },
})

animate(words, {
  y: [
    { to: ['100%', '0%'] },
    { to: '-100%', delay: 750, ease: 'in(3)' }
  ],
  duration: 750,
  ease: 'out(3)',
  delay: stagger(100),
  loop: true,
});

Anterior
Próximo
linhas

personagens
Anime.js só é possível graças aos nossos incríveis patrocinadores:

Ice Open Network
Ice Open Network

Warp
Warp

Juspay
Juspay

Meta de financiamento
20%
Rodrigo Sales




Começando
Temporizador
Animação
Linha do tempo
Animável
Arrastável
Escopo
Eventos
SVG
Texto
splitText()
Configurações
linhas
palavras
personagens
depurar
incluirEspaços
acessível
Parâmetros de divisão
Modelo HTML
Métodos
Propriedades
Serviços públicos
Flexibilizações
WAAPI
Motor
Texto
  
splitText()
  
Configurações

Desde a versão 4.1.0

personagens
Define se e como os caracteres devem ser divididos.
Os elementos dos caracteres divididos são acessados ​​por meio de uma matriz retornada pela charspropriedade de uma TextSplitinstância.

const { chars } = splitText(target, { chars: true });

Wrappers divididos padrão
Por padrão, cada caractere é envolvido em um elemento span com os seguintes estilos e atributos de dados:

<span style="display: inline-block;" data-line="0" data-word="0" data-char="0">H</span>
<span style="display: inline-block;" data-line="0" data-word="0" data-char="1">E</span>
<span style="display: inline-block;" data-line="0" data-word="0" data-char="2">Y</span>

Envoltórios divididos personalizados
Os wrappers divididos podem ser configurados passando um Objectde
Parâmetros de divisão
ou passando um personalizado
Modelo HTML
 String.

Animação de caracteres mesmo quando divididos por linhas.
Cada divisão de linha sobrescreve os elementos de caractere existentes, o que faz com que as animações de caractere em execução parem assim que as fontes forem carregadas ou sempre que o elemento de texto for redimensionado.
Declarar uma animação dentro do
split.addEffect()
O método garante a reprodução contínua entre redimensionamentos e reverte automaticamente ao usar o dispositivo.
split.revert()
.

const split = splitText(target, params);

split.addEffect(({ lines, words, chars }) => animate([lines, words, chars], {
  opacity: { from: 0 },
}));

split.revert(); // This also reverts the animation declared with addEffect

Aceita
Boolean
Objectde
Parâmetros de divisão
Modelo HTML
 String
Padrão
false

exemplo de código de caracteres


import { animate, splitText, stagger } from 'animejs';

const { chars } = splitText('p', {
  chars: { wrap: 'clip' },
});

animate(chars, {
  y: [
    { to: ['100%', '0%'] },
    { to: '-100%', delay: 750, ease: 'in(3)' }
  ],
  duration: 750,
  ease: 'out(3)',
  delay: stagger(50),
  loop: true,
});

Anterior
Próximo
palavras

depurar
Anime.js só é possível graças aos nossos incríveis patrocinadores:

Ice Open Network
Ice Open Network

Warp
Warp

Juspay
Juspay

Meta de financiamento
20%
Rodrigo Sales


Ajude o projeto a sobreviver,Torne-se um patrocinador.

Pesquisar documentação...
anime.js logo v4



G
splitText()
Settings
lines
words
chars
debug
includeSpaces
accessible
Split parameters
HTML template
Methods
Properties
Utilities
Easings
WAAPI
Engine
Text  splitText()  Settings

Since 4.1.0

accessible
Creates an accessible cloned element that preserves the structure of the original split element.

splitText(target, { accessible: true });

Accepts
Boolean

Default
true

accessible code example

CSS

import { createTimeline, splitText, stagger, utils } from 'animejs';

const [ $button ] = utils.$('button');
const split = splitText('p', { debug: true });
const $accessible = split.$target.firstChild;

$accessible.style.cssText = `
  opacity: 0;
  position: absolute;
  color: var(--hex-green-1);
  width: 100%;
  height: 100%;
  left: 0;
  top: 0;
  outline: currentColor dotted 1px;
`;

const showAccessibleClone = createTimeline({
  defaults: { ease: 'inOutQuad' },
})
.add($accessible, {
  opacity: 1,
  z: '-2rem',
}, 0)
.add('p', {
  rotateX: 0,
  rotateY: 60
}, 0)
.add(split.words, {
  z: '6rem',
  opacity: .75,
  outlineColor: { from: '#FFF0' },
  duration: 750,
  delay: stagger(40, { from: 'random' })
}, 0)
.init();

const toggleAccessibleClone = () => {
  showAccessibleClone.alternate().resume();
}
 
$button.addEventListener('click', toggleAccessibleClone);

Previous
Next
includeSpaces

Split parameters




anime.js logo v4



Engine
Text  splitText()  Split parameters

Since 4.1.0

class
Specifies a custom CSS class applied to all split elements.

Outputs
<span class="my-custom-class" style="display: inline-block;">
  <span style="display: inline-block;">word</span>
</span>

Accepts
String
null
Default
null

class code example

CSS

import { animate, stagger, splitText } from 'animejs';

splitText('p', {
  chars: { class: 'split-char' },
});

animate('.split-char', {
  y: ['0rem', '-1rem', '0rem'],
  loop: true,
  delay: stagger(100)
});

Previous
Next
Split parameters

wrap




anime.js logo v4



Engine
Text  splitText()  Split parameters

Since 4.1.0

wrap
Adds an extra wrapper element with the specified CSS 
overflow
 property to all split elements.

Outputs
<span style="overflow: clip; display: inline-block;">
  <span style="display: inline-block;">word</span>
</span>

Accepts
'hidden' | 'clip' | 'visible' | 'scroll' | 'auto'
Boolean (true is equivalent to 'clip')
null
Default
null

wrap code example


import { animate, stagger, splitText } from 'animejs';

const { chars } = splitText('p', {
  chars: { wrap: true },
});

animate(chars, {
  y: ['75%', '0%'],
  duration: 750,
  ease: 'out(3)',
  delay: stagger(50),
  loop: true,
  alternate: true,
});

Previous
Next
class

clone




anime.js logo v4



Engine
Text  splitText()  Split parameters

Since 4.1.0

clone
Clones the split elements in the specified direction by wrapping the lines, words, or characters within the following HTML structure and setting the top and left CSS properties accordingly.

Outputs
<span style="position: relative; display: inline-block;">
  <span style="display: inline-block;">word</span>
  <span style="position: absolute; top: 100%; left: 0px; white-space: nowrap; display: inline-block;">word</span>
</span>

Accepts
'left' | 'top' | 'right' | 'bottom' | 'center'
Boolean (true is equivalent to 'center')
null
Default
null

clone code example


import { createTimeline, stagger, splitText } from 'animejs';

const { chars } = splitText('p', {
  chars: {
    wrap: 'clip',
    clone: 'bottom'
  },
});

createTimeline()
.add(chars, {
  y: '-100%',
  loop: true,
  loopDelay: 350,
  duration: 750,
  ease: 'inOut(2)',
}, stagger(150, { from: 'center' }));

Previous
Next
wrap

HTML template




anime.js logo v4



G
splitText()
Settings
Split parameters
HTML template
Methods
Properties
Utilities
Easings
WAAPI
Engine
Text  splitText()

Since 4.1.0

HTML template
Custom HTML templates can be used on the 
lines
, 
words
, and 
chars
 properties, which then serve as wrappers for all split elements.

The HTML template must contain at least one '{value}' variable that will be replaced by the split value. Similarly, the '{i}' variable can be used and will be replaced by the current split index.

All the necessary styles, like 'display: inline-block;', will be applied automatically and don't need to be defined in the template.

For example, if you pass the following template to the char parameter like this:

splitText('p', { chars: '<em class="char-{i}">{value}</em>' });

The split output will be:

<p>
  <em class="char-0" style="display: inline-block;">H</em>
  <em class="char-1" style="display: inline-block;">E</em>
  <em class="char-2" style="display: inline-block;">L</em>
  <em class="char-3" style="display: inline-block;">L</em>
  <em class="char-4" style="display: inline-block;">O</em>
</p>

Accepts
A String containing at least one reference to '{value}'

HTML template code example

CSS

import { createTimeline, stagger, splitText } from 'animejs';

splitText('p', {
  chars: `<span class="char-3d word-{i}">
    <em class="face face-top">{value}</em>
    <em class="face-front">{value}</em>
    <em class="face face-bottom">{value}</em>
  </span>`,
});

const charsStagger = stagger(100, { start: 0 });

createTimeline({ defaults: { ease: 'linear', loop: true, duration: 750 }})
.add('.char-3d', { rotateX: -90 }, charsStagger)
.add('.char-3d .face-top', { opacity: [.5, 0] }, charsStagger)
.add('.char-3d .face-front', { opacity: [1, .5] }, charsStagger)
.add('.char-3d .face-bottom', { opacity: [.5, 1] }, charsStagger);


TextSplitter methods




anime.js logo v4



G
splitText()
Settings
Split parameters
HTML template
Methods
addEffect()
revert()
refresh()
Properties
Utilities
Easings
WAAPI
Engine
Text  splitText()  Methods

Since 4.1.0

revert()
Reverts the split target html back to its original state, removing debug styles and reverting all animations added with 
split.addEffect()
 in the process.

Returns
TextSplitter

revert() code example


import { animate, stagger, splitText, utils } from 'animejs';

const [ $button ] = utils.$('button');
const [ $p ] = utils.$('p');

const split = splitText('p', {
  words: { wrap: 'clip' },
  debug: true,
});

split.addEffect((self) => animate(self.words, {
  y: ['100%', '0%'],
  duration: 1250,
  ease: 'out(3)',
  delay: stagger(100),
  loop: true,
  alternate: true,
}));

const revertSplit = () => {
  split.revert();
  $button.setAttribute('disabled', 'true');
}

$button.addEventListener('click', revertSplit);

Previous
Next
addEffect()

refresh()

