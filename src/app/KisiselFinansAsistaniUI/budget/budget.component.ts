import { Component, Renderer2 } from '@angular/core';

@Component({
  selector: 'app-budget',
  standalone: true,
  imports: [],
  templateUrl: './budget.component.html',
  styleUrl: './budget.component.css'
})
export class BudgetComponent {
  ngOnInit() {
    this.loadScript('assets/js/test.js');
    this.loadScript('assets/vendor/jquery/jquery.min.js');
    this.loadScript('assets/vendor/datatables/jquery.dataTables.min.js');
    this.loadScript('assets/vendor/datatables/dataTables.bootstrap4.min.js');
    this.loadScript('assets/js/demo/datatables-demo.js');

  }

  constructor(private renderer: Renderer2) { }
  private loadScript(src: string): void {
    const script = this.renderer.createElement('script');
    script.src = src;
    script.type = 'text/javascript';
    script.async = true;
    this.renderer.appendChild(document.body, script);
  }
}
