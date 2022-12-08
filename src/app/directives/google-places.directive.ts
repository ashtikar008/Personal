import { Directive, ElementRef, Output, EventEmitter } from '@angular/core';
declare const google: any;
@Directive({
  selector: '[appGooglePlaces]'
})
export class GooglePlacesDirective {
  @Output() onSelect: EventEmitter<any> = new EventEmitter();
  private element!: HTMLInputElement;

  constructor(private elRef?: ElementRef) {
    this.element = elRef?.nativeElement;
  }

  getFormattedAddress(place: any) {
    return place;
  }

  ngOnInit() {
    var options = {
      componentRestrictions: { country: 'au' },
    };
    const autocomplete = new google.maps.places.Autocomplete(this.element, options);
    google.maps.event.addListener(autocomplete, 'place_changed', () => {
      this.onSelect.emit(this.getFormattedAddress(autocomplete.getPlace()));
    });
  }

}
