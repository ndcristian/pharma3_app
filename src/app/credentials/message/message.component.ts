import { Component, OnInit } from '@angular/core';
import {  ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-message',
  templateUrl: './message.component.html',
  styleUrls: ['./message.component.scss']
})
export class MessageComponent implements OnInit {

  event: any = {message:""};

  constructor(private route: ActivatedRoute) { }

  ngOnInit(): void {

    this.event.message = this.route.snapshot.paramMap.get('message');
    if(this.event.message==""){}
    // console.log("%%%%%%%%", this.event);
  }

}
