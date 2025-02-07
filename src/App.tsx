
import { useEffect, useState } from 'react';
import './App.css'  
import { v4 as uuidv4 } from 'uuid';
import {
  Airplane, AirplaneInFlight, Anchor, AppleLogo, ArchiveBox,
  ArchiveTray, Armchair, Backpack, Balloon, Bathtub, Bed,
  BeerBottle, /* Bicycle, Binoculars, Boat, Book, BookOpen,
  Briefcase, BracketsAngle, Bus, Cake, Camera, Car, CarSimple,
  Chair, Chats, DiceFour, Dog, Door, Envelope, Eyedropper,
  FilmSlate, GameController, Guitar, Laptop, Lightbulb, MapPin,
  Microphone, Television, Umbrella,*/ QuestionMark
} from  '@phosphor-icons/react';



const iconNames = [
  Airplane, AirplaneInFlight, Anchor, AppleLogo, ArchiveBox,
  ArchiveTray, Armchair, Backpack, Balloon, Bathtub,
  Bed, BeerBottle/*, Bicycle, Binoculars
  , Boat,
  Book, BookOpen, Briefcase, BracketsAngle, Bus,
  Cake, Camera, Car, CarSimple
  , Chair,
  Chats, DiceFour, Dog, Door, Envelope,
  Eyedropper, FilmSlate, GameController, Guitar, Laptop,
  Lightbulb, MapPin, Microphone, Television, Umbrella*/
];

const colors = [
  "black", "maroon", "red", "purple", "fuchsia",
  "green", "lime", "olive", "yellow", "navy", "blue", "teal", "aqua",
  "orange", "brown", "darkblue", "darkcyan", "darkgoldenrod", "darkgreen",
  "darkkhaki", "darkmagenta", "darkolivegreen", "darkorange", "darkorchid",
  "darkred", "darkseagreen", "darkslateblue", "darkslategray",
  "darkturquoise", "darkviolet", "deeppink", "deepskyblue", "dodgerblue",
  "firebrick", "forestgreen", "gold", "goldenrod", "greenyellow", "hotpink",
  "indianred", "indigo", "khaki", "lawngreen", "lightseagreen", "lightskyblue",
  "limegreen", "magenta", "mediumaquamarine", "mediumblue", "mediumorchid",
  "mediumpurple", "mediumseagreen", "mediumslateblue", "mediumspringgreen",
  "mediumturquoise", "mediumvioletred", "midnightblue", "olive", "orangered",
  "orchid", "palegreen", "paleturquoise", "palevioletred", "peachpuff", "peru",
  "pink", "plum", "powderblue", "royalblue", "saddlebrown", "salmon",
  "seagreen", "sienna", "skyblue", "slateblue", "slategray", "springgreen",
  "steelblue", "tan", "thistle", "tomato", "turquoise", "violet", "yellowgreen"
];

interface ICard {
  id: string;
  Icon: React.ElementType
  color: string;
  isActived: boolean; 
  isMatched: boolean; 
  name:string;
}

function shuffleArray<T>(array: T[]) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}


 
function App() {

  const [cards, setCards] = useState<ICard[]>([]);
  const [board, setBoard] = useState<JSX.Element[]>([]);  
  const [currentCard, setCurrentCard] = useState<ICard>();
  const [numOfAttempts, setNumOfAttempts] = useState<number>(0);

  function buildCards(iconNames: React.ElementType[], colors: string[]){ 

    const objCards : ICard[] = iconNames.map((Icon) => {

      const id = uuidv4();
      const min = 0;
      const max = colors.length - 1;
      const randomIndex = Math.floor(Math.random() * (max - min + 1)) + min;
      return {id: id, Icon: Icon, color: colors[randomIndex], isActived: false, isMatched: false, name:id.toString() }
    });
  
    //duplica os itens e embaralha    
    //objCards = shuffleArray(objCards.concat(objCards));  
     const objCards2 = objCards.map(card => ({ ...card, id: uuidv4()}));
     const objCards3 = shuffleArray(objCards.concat(objCards2));

   
    setCards(objCards3);
    
  }   
 
  function buildBoard(objCards: ICard[]){     

    const icons = objCards.map(({id, Icon, color, isActived, isMatched, name} : ICard ) => {
      const key = uuidv4(); 
      const flipped = isMatched ? 'flipped' : '';
      return  (
        <div className={`card ${flipped}`} key={key} onClick={ (event) => {handleFlipCard(event); }}>
          <div className="front" id="cardFront"> 
            <QuestionMark key={key} data-id={id} size={100} weight="bold" color="black" />  
            {/* name é um hash gerado pelo uuid. */}
            <small style={{ fontSize: '12px' }}>{name}</small>
          </div>
          <div className="back" id="cardBack">
            <Icon key={key} size={100} weight="duotone" isactive={isActived.toString()} ismatched={isMatched.toString()} color={color} />
          </div>
        </div>        
      )
              
    });

    setBoard(icons);    
  }

  function handleFlipCard(event: React.MouseEvent<HTMLDivElement>) {

    const idCurrentCard = event.currentTarget.children[0].children[0].getAttribute('data-id');    
 
    //verifica se é possivel jogar. Para isso somente 1 card pode estar ativo    
    if(quantityActiveCards() >= 2) {
      alert('Essa jogada não é permitida!'); 
      return;
    }

    //verficar se o MESMO card clicado já está ativo
    const flipedCard = event.currentTarget.classList.contains('flipped');
    if( flipedCard ) {
      alert('Escolha outro card!');
      return;
    }

    //ativa o card no estado cards no id correspondente
    const cardsUpdated = cards.map((card) => {
      if(card.id === idCurrentCard){
        card.isActived = true; 
        setCurrentCard(card);  
        console.log('currentCard');
        console.log(card);            
      }
      return card
    })

    //Verifica se deu match comparando pelo name do objeto card. O name é um hash gerado pelo uuid. 
    //Sempre haverá um match, pois o array de cards foi duplicado, modificando apenas o id. 
    //Por isso, a comparação é feita pelo name.
    const cardsMatched = cardsUpdated.filter((card) => card.isActived);
    if( cardsMatched.length === 2 ){
      console.log("cardsMatched");
      console.log(cardsMatched);
 
      if( cardsMatched[0].name === cardsMatched[1].name ){
        console.log('Match!');
        //Agora é necessário atualizar o estado dos cards para isMatched = true e isActived = false
        
        
        setNumOfAttempts(state => state + 1);

        cards.map(card => {
          if( card.name === cardsMatched[0].name || card.name === cardsMatched[1].name ){
            card.isActived = false;
            card.isMatched = true; 
          } 
          return card;
        })  
        //parou aqui                 
      }else//Se nao deu match
      {       
        setNumOfAttempts(state => state + 1);
        //console.log('Não deu Match!');
 
        //Desvira as cartas após 1 segundo
        setTimeout(() => {          
          //Pega as cartas ativas
          const activeCards = getActiveCards();   
          const cardDiv1 = getCardDivFromDOMById(activeCards[0].id)!;
          const cardDiv2 = getCardDivFromDOMById(activeCards[1].id)!;
          cardDiv1.closest('.card')?.classList.toggle('flipped'); 
          cardDiv2.closest('.card')?.classList.toggle('flipped');

          //Desativa as cartas ativas
          cards.map(card => {
            if( card.name === activeCards[0].name || card.name === activeCards[1].name ){
              card.isActived = false; 
            } 
            return card;
          })
        }, 1000);  

      }  
      
      //verifica se o numero total de cartas foi atingido
      if( quantityMatchedCards() === cards.length / 2 ){
        alert('Parabéns! Você ganhou!'); 
        
        //Reinicia o jogo
        buildCards(iconNames, colors);
      } 
    }   
  }


  

  function quantityActiveCards() : number{     
    const activeCards = cards.filter((card) => card.isActived);
    return activeCards.length;
  }

  function quantityMatchedCards() : number{     
    const activeCards = cards.filter((card) => card.isMatched);
    return (activeCards.length) / 2;
  }

  function getActiveCards() : ICard[] {
    return cards.filter((card) => card.isActived);
  }
  /*
  function verifyMatchFromActiveCards() : boolean {
    const activeCards = getActiveCards();
    if( activeCards.length === 2 ){
      if( activeCards[0].name === activeCards[1].name ){
        return true;
      }else{
        return false;
      }
    }
    return false;
  }
    */

  function getCardDivFromDOMById(id: string) : HTMLElement | null {
    return document.querySelector(`[data-id="${id}"]`);
  }  

  useEffect(() => {
    
    if( currentCard ){
     // const cardDiv = document.querySelector(`[data-id="${currentCard.id}"]`);
     const cardDiv = getCardDivFromDOMById(currentCard.id);
      if( cardDiv ){ 
        cardDiv.closest('.card')?.classList.toggle('flipped');  
        console.log('cards');
        console.log(cards);
      }
    }    
     

  } ,[currentCard, cards])
 
  useEffect(() => {
    buildCards(iconNames, colors);
  },[])
 
  useEffect(() => {  
     buildBoard(cards);    
  }, [cards])

   
  return (
    <>
    <div>
      <p><strong>Matched Cards:</strong> {quantityMatchedCards()}</p>
      <p><strong>Num Of Attempts:</strong> {numOfAttempts}</p>
    </div>
    <div className="col d-flex flex-wrap">      
      {board} 
    </div>     
    </>
  )
}

export default App
