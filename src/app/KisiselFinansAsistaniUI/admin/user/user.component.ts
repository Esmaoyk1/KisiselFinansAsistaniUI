import { Component, OnInit, Renderer2 } from '@angular/core';
import { UserapiService } from '../../../services/user-api.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-user',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent implements OnInit {
  pictureUrl: string = 'http://localhost:5177/uploads/';
  users: any[] = []; // Kullanıcı verilerini tutmak için bir dizi

  constructor(private userApiService: UserapiService,
    private renderer: Renderer2,) { }

  ngOnInit(): void {
    this.getUsers(); // bileşen yüklendiğinde kullanıcıları al
    this.loadScriptsSequentially();

    this.loadCss('assets/vendor/datatables/dataTables.bootstrap4.min.css');
   

   
  }

  getUsers(): void {
    this.userApiService.getUsers().subscribe(
      (data) => {
        console.log(data);
        this.users = data; // API'den gelen kullanıcı verilerini diziye ata
     
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
