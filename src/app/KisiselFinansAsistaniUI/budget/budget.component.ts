import { Component, Renderer2 } from '@angular/core';
import { BudgetService } from '../../services/budget.service';

@Component({
  selector: 'app-budget',
  standalone: true,
  imports: [],
  templateUrl: './budget.component.html',
  styleUrl: './budget.component.css'
})
export class BudgetComponent {

  items: any[] = []; // Bütçe öğelerini tutacak dizi
  newItem = { name: '', amount: null, type: '', date: '' }; 

  ngOnInit() {
    this.loadScriptsSequentially();

    this.loadCss('assets/vendor/datatables/dataTables.bootstrap4.min.css');

    //this.loadScript('assets/js/test.js');
    //this.loadScript('assets/vendor/jquery/jquery.min.js');
    //this.loadScript('assets/vendor/datatables/jquery.dataTables.min.js');
    //this.loadScript('assets/vendor/datatables/dataTables.bootstrap4.min.js');
    //this.loadScript('assets/js/demo/datatables-demo.js');


    this.loadItems();

  }

  constructor(private renderer: Renderer2, private budgetService: BudgetService) { }
  async loadScriptsSequentially() {
    try {
      await this.loadScript('assets/vendor/jquery/jquery.min.js');
      console.log('jQuery yüklendi.');
      await this.loadScript('assets/vendor/datatables/jquery.dataTables.min.js');
      console.log('DataTables JS yüklendi.');
      await this.loadScript('assets/vendor/datatables/dataTables.bootstrap4.min.js');
      console.log('Bootstrap DataTables yüklendi.');
      await this.loadScript('assets/js/demo/datatables-demo.js');
      console.log('Demo script yüklendi.');
      await this.loadScript('assets/js/test.js');
      console.log('Test script yüklendi.');
    } catch (error) {
      console.error(error);
    }
  }
  loadScript(scriptUrl: string): Promise<void> {
    return new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = scriptUrl;
      script.async = true;
      script.onload = () => resolve();
      script.onerror = () => reject(`Script yüklenemedi: ${scriptUrl}`);
      document.body.appendChild(script);
    });
  }

  //private loadScript(src: string): void {
  //  const script = this.renderer.createElement('script');
  //  script.src = src;
  //  script.type = 'text/javascript';
  //  script.async = true;
  //  this.renderer.appendChild(document.body, script);
  //}
  private loadCss(url: string) {
    const link = this.renderer.createElement('link');
    link.rel = 'stylesheet';
    link.type = 'text/css';
    link.href = url;
    this.renderer.appendChild(document.head, link);
  }


  loadItems() {
    this.budgetService.getPosts().subscribe(data => {
      this.items = data; // Öğeleri al ve diziye ata
    });
  }

  addItem() {
    this.budgetService.createPost(this.newItem).subscribe(() => {
      this.loadItems(); // Yeni öğe ekledikten sonra öğeleri yeniden yükle
      this.newItem = { name: '', amount: null, type: '', date: '' }; // Formu sıfırla
    });
  }
}
