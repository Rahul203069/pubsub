import { Container } from "dockerode";



const maxConatiner = 10;


export class ContainersfleetManager{

public container:Container[]=[]

public addContainer(container:Container){

this.container.push(  container);

}

public removeContainer(container:Container){

    this.container = this.container.filter((containerId)=>containerId!==container);
}

public numberOfContainers(){
    return this.container.length;
}



}



