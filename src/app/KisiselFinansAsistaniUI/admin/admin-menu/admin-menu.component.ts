import { Component, Renderer2 } from '@angular/core';
import { UserapiService } from '../../../services/user-api.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-admin-menu',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './admin-menu.component.html',
  styleUrl: './admin-menu.component.css'
})
export class AdminMenuComponent {
  pictureUrl: string = 'http://localhost:5177/uploads/';
  admins: any[] = [];

  constructor(private userApiService: UserapiService,
    private renderer: Renderer2,) { }


  ngOnInit(): void {
    this.getAdmins(); // bileşen yüklendiğinde kullanıcıları al
    this.loadScriptsSequentially();
    this.loadCss('assets/vendor/datatables/dataTables.bootstrap4.min.css');

  }

  getAdmins(): void {
    this.userApiService.getUsers().subscribe(
      (data) => {
        console.log("admin bilgileri");
        console.log(data.adminUsers);
     
        this.admins = [...data.adminUsers];
        //this.admins = data.adminUsers || []; // adminUsers dizisi olup olmadığını kontrol et
      },
      (error) => {
        console.error('Kullanıcı verileri alınamadı:', error); // Hata durumunu yönet
      }
    );
  }


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

  private loadCss(url: string) {
    const link = this.renderer.createElement('link');
    link.rel = 'stylesheet';
    link.type = 'text/css';
    link.href = url;
    this.renderer.appendChild(document.head, link);
  }


}
