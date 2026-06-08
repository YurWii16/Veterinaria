import { Directive, ElementRef, Input, OnInit, Renderer2 } from '@angular/core';

@Directive({
  selector: '[appHighlightUpcoming]',
  standalone: false
})
export class HighlightUpcomingDirective implements OnInit {
  @Input('appHighlightUpcoming') appointmentDate!: string | Date;

  constructor(private el: ElementRef, private renderer: Renderer2) {}

  ngOnInit(): void {
    if (!this.appointmentDate) return;

    const apptTime = new Date(this.appointmentDate).getTime();
    const now = new Date().getTime();
    
    // Calculate difference in milliseconds
    const diffMs = apptTime - now;
    
    // Check if appointment is in the future and within 24 hours (86,400,000 milliseconds)
    const isUpcoming = diffMs > 0 && diffMs <= 24 * 60 * 60 * 1000;

    if (isUpcoming) {
      this.renderer.addClass(this.el.nativeElement, 'upcoming-highlight');
      
      // Add a small glowing dot or indicator badge next to it using standard DOM if needed
      // but adding a class is the cleanest approach since it leverages our CSS styles
    }
  }
}
